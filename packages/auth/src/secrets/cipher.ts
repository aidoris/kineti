import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto"

import {
  SECRETS_AUTH_TAG_LENGTH,
  SECRETS_BLOB_PREFIX,
  SECRETS_BLOB_VERSION,
  SECRETS_CIPHER_ALGO,
  SECRETS_IV_LENGTH,
} from "./constants"
import { getAiProviderSecretsConfig } from "./env"
import type {
  ApiKeyAtRest,
  ApiKeyPersistenceFields,
  AiProviderSecretsConfig,
  AiProviderSecretsKeyRing,
  EncryptedApiKey,
  ReadStoredApiKeyResult,
  ReencryptApiKeyResult,
} from "./types"

const getConfig = (config?: AiProviderSecretsConfig): AiProviderSecretsConfig =>
  config ?? getAiProviderSecretsConfig()

export const isEncryptedApiKeyBlob = (value: string): boolean =>
  value.startsWith(`${SECRETS_BLOB_PREFIX}:`)

const encodeBlob = (
  keyId: string,
  iv: Buffer,
  ciphertext: Buffer,
  authTag: Buffer
): string => {
  const payload = Buffer.concat([ciphertext, authTag]).toString("base64url")

  return [
    SECRETS_BLOB_PREFIX,
    SECRETS_BLOB_VERSION,
    keyId,
    iv.toString("base64url"),
    payload,
  ].join(":")
}

const decodeBlob = (
  blob: string
): { keyId: string; iv: Buffer; ciphertext: Buffer; authTag: Buffer } => {
  const parts = blob.split(":")

  if (parts.length !== 5) {
    throw new Error("Invalid encrypted API key blob format")
  }

  const [prefix, version, keyId, ivEncoded, payloadEncoded] = parts

  if (prefix !== SECRETS_BLOB_PREFIX) {
    throw new Error("Invalid encrypted API key blob prefix")
  }

  if (version !== SECRETS_BLOB_VERSION) {
    throw new Error(`Unsupported encrypted API key version: ${version}`)
  }

  if (!keyId) {
    throw new Error("Encrypted API key blob is missing key id")
  }

  const iv = Buffer.from(ivEncoded, "base64url")
  const payload = Buffer.from(payloadEncoded, "base64url")

  if (iv.length !== SECRETS_IV_LENGTH) {
    throw new Error("Invalid encrypted API key IV length")
  }

  if (payload.length <= SECRETS_AUTH_TAG_LENGTH) {
    throw new Error("Invalid encrypted API key payload length")
  }

  const authTag = payload.subarray(payload.length - SECRETS_AUTH_TAG_LENGTH)
  const ciphertext = payload.subarray(0, payload.length - SECRETS_AUTH_TAG_LENGTH)

  return { keyId, iv, ciphertext, authTag }
}

const resolveKey = (keyRing: AiProviderSecretsKeyRing, keyId: string): Buffer => {
  const key = keyRing.get(keyId)

  if (!key) {
    throw new Error(`Unknown AI provider secrets encryption key id: ${keyId}`)
  }

  return key
}

export const encryptApiKey = (
  plaintext: string,
  config?: AiProviderSecretsConfig
): EncryptedApiKey => {
  const { activeKeyId, keyRing } = getConfig(config)
  const key = resolveKey(keyRing, activeKeyId)
  const iv = randomBytes(SECRETS_IV_LENGTH)
  const cipher = createCipheriv(SECRETS_CIPHER_ALGO, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  return {
    keyId: activeKeyId,
    ciphertext: encodeBlob(activeKeyId, iv, encrypted, authTag),
  }
}

export const decryptApiKey = (
  blob: string,
  config?: AiProviderSecretsConfig
): string => {
  if (!isEncryptedApiKeyBlob(blob)) {
    return blob
  }

  const { keyId, iv, ciphertext, authTag } = decodeBlob(blob)
  const { keyRing } = getConfig(config)
  const key = resolveKey(keyRing, keyId)
  const decipher = createDecipheriv(SECRETS_CIPHER_ALGO, key, iv)
  decipher.setAuthTag(authTag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8")
}

export const reencryptApiKeyIfNeeded = (
  stored: EncryptedApiKey | { ciphertext: string; keyId?: string | null },
  config?: AiProviderSecretsConfig
): ReencryptApiKeyResult | null => {
  const { activeKeyId } = getConfig(config)
  const ciphertext = stored.ciphertext
  const storedKeyId =
    stored.keyId ??
    (isEncryptedApiKeyBlob(ciphertext)
      ? decodeBlob(ciphertext).keyId
      : null)

  if (!isEncryptedApiKeyBlob(ciphertext)) {
    const encrypted = encryptApiKey(ciphertext, config)
    return { ...encrypted, rotated: true }
  }

  if (storedKeyId === activeKeyId) {
    return {
      ciphertext,
      keyId: storedKeyId,
      rotated: false,
    }
  }

  const plaintext = decryptApiKey(ciphertext, config)
  const encrypted = encryptApiKey(plaintext, config)

  return { ...encrypted, rotated: true }
}

export const parseEncryptionKeyIdFromBlob = (
  ciphertext: string
): string | null => {
  if (!isEncryptedApiKeyBlob(ciphertext)) {
    return null
  }

  return decodeBlob(ciphertext).keyId
}

export const encryptApiKeyForPersistence = (
  plaintext: string,
  config?: AiProviderSecretsConfig
): ApiKeyPersistenceFields => {
  const encrypted = encryptApiKey(plaintext, config)

  return {
    apiKeyCiphertext: encrypted.ciphertext,
    encryptionKeyId: encrypted.keyId,
  }
}

export const decryptStoredApiKey = (
  row: ApiKeyAtRest,
  config?: AiProviderSecretsConfig
): string => decryptApiKey(row.apiKeyCiphertext, config)

export const readStoredApiKey = (
  row: ApiKeyAtRest,
  config?: AiProviderSecretsConfig
): ReadStoredApiKeyResult => {
  const plaintext = decryptStoredApiKey(row, config)
  const reencrypted = reencryptApiKeyIfNeeded(
    {
      ciphertext: row.apiKeyCiphertext,
      keyId: row.encryptionKeyId,
    },
    config
  )

  if (!reencrypted?.rotated) {
    return { plaintext, persistence: null }
  }

  return {
    plaintext,
    persistence: {
      apiKeyCiphertext: reencrypted.ciphertext,
      encryptionKeyId: reencrypted.keyId,
    },
  }
}
