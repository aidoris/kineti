import { randomBytes } from "node:crypto"
import { afterEach, describe, expect, test } from "bun:test"

import {
  decryptApiKey,
  encryptApiKey,
  encryptApiKeyForPersistence,
  isEncryptedApiKeyBlob,
  readStoredApiKey,
  reencryptApiKeyIfNeeded,
} from "./cipher"
import type { AiProviderSecretsConfig } from "./types"

const testKeyV1 = randomBytes(32)
const testKeyV2 = randomBytes(32)

const v1Config: AiProviderSecretsConfig = {
  activeKeyId: "v1",
  keyRing: new Map([
    ["v1", testKeyV1],
    ["v2", testKeyV2],
  ]),
}

const v2Config: AiProviderSecretsConfig = {
  activeKeyId: "v2",
  keyRing: v1Config.keyRing,
}

const originalEnv = {
  activeKeyId: process.env.AI_PROVIDER_SECRETS_ACTIVE_KEY_ID,
  keys: process.env.AI_PROVIDER_SECRETS_KEYS,
}

afterEach(() => {
  if (originalEnv.activeKeyId === undefined) {
    delete process.env.AI_PROVIDER_SECRETS_ACTIVE_KEY_ID
  } else {
    process.env.AI_PROVIDER_SECRETS_ACTIVE_KEY_ID = originalEnv.activeKeyId
  }

  if (originalEnv.keys === undefined) {
    delete process.env.AI_PROVIDER_SECRETS_KEYS
  } else {
    process.env.AI_PROVIDER_SECRETS_KEYS = originalEnv.keys
  }
})

describe("ai provider api key secrets", () => {
  test("encrypts and decrypts round-trip", () => {
    const plaintext = "sk-test-openai-key"
    const encrypted = encryptApiKey(plaintext, v1Config)

    expect(isEncryptedApiKeyBlob(encrypted.ciphertext)).toBe(true)
    expect(encrypted.keyId).toBe("v1")
    expect(decryptApiKey(encrypted.ciphertext, v1Config)).toBe(plaintext)
  })

  test("encryptApiKeyForPersistence returns column fields", () => {
    const fields = encryptApiKeyForPersistence("sk-live", v1Config)

    expect(fields.encryptionKeyId).toBe("v1")
    expect(isEncryptedApiKeyBlob(fields.apiKeyCiphertext)).toBe(true)
  })

  test("decrypts legacy plaintext at rest", () => {
    expect(decryptApiKey("sk-plaintext-legacy", v1Config)).toBe(
      "sk-plaintext-legacy"
    )
  })

  test("re-encrypts when active key changes", () => {
    const encrypted = encryptApiKey("sk-rotate", v1Config)
    const rotated = reencryptApiKeyIfNeeded(encrypted, v2Config)

    expect(rotated?.rotated).toBe(true)
    expect(rotated?.keyId).toBe("v2")
    expect(decryptApiKey(rotated!.ciphertext, v2Config)).toBe("sk-rotate")
  })

  test("readStoredApiKey returns persistence when rotation needed", () => {
    const encrypted = encryptApiKey("sk-lazy", v1Config)
    const read = readStoredApiKey(
      {
        apiKeyCiphertext: encrypted.ciphertext,
        encryptionKeyId: encrypted.keyId,
      },
      v2Config
    )

    expect(read.plaintext).toBe("sk-lazy")
    expect(read.persistence?.encryptionKeyId).toBe("v2")
  })
})
