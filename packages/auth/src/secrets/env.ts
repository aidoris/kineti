import {
  SECRETS_KEY_LENGTH,
} from "./constants"
import type { AiProviderSecretsConfig, AiProviderSecretsKeyRing } from "./types"

const parseKeyRingJson = (raw: string): AiProviderSecretsKeyRing => {
  let parsed: unknown

  try {
    parsed = JSON.parse(raw) as unknown
  } catch {
    throw new Error("AI_PROVIDER_SECRETS_KEYS must be valid JSON")
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AI_PROVIDER_SECRETS_KEYS must be a JSON object of key id → base64 key")
  }

  const ring = new Map<string, Buffer>()

  for (const [keyId, value] of Object.entries(parsed)) {
    if (!keyId.trim()) {
      throw new Error("AI_PROVIDER_SECRETS_KEYS contains an empty key id")
    }

    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`AI_PROVIDER_SECRETS_KEYS["${keyId}"] must be a non-empty base64 string`)
    }

    const keyBytes = Buffer.from(value, "base64")

    if (keyBytes.length !== SECRETS_KEY_LENGTH) {
      throw new Error(
        `AI_PROVIDER_SECRETS_KEYS["${keyId}"] must decode to ${SECRETS_KEY_LENGTH} bytes (use: openssl rand -base64 32)`
      )
    }

    ring.set(keyId, keyBytes)
  }

  if (ring.size === 0) {
    throw new Error("AI_PROVIDER_SECRETS_KEYS must contain at least one key")
  }

  return ring
}

export const getAiProviderSecretsConfig = (): AiProviderSecretsConfig => {
  const activeKeyId = process.env.AI_PROVIDER_SECRETS_ACTIVE_KEY_ID?.trim()
  const keysJson = process.env.AI_PROVIDER_SECRETS_KEYS?.trim()

  if (!activeKeyId) {
    throw new Error("AI_PROVIDER_SECRETS_ACTIVE_KEY_ID is required")
  }

  if (!keysJson) {
    throw new Error("AI_PROVIDER_SECRETS_KEYS is required")
  }

  const keyRing = parseKeyRingJson(keysJson)

  if (!keyRing.has(activeKeyId)) {
    throw new Error(
      `AI_PROVIDER_SECRETS_ACTIVE_KEY_ID "${activeKeyId}" is not present in AI_PROVIDER_SECRETS_KEYS`
    )
  }

  return { activeKeyId, keyRing }
}
