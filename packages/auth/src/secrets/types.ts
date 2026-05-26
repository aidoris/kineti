export type AiProviderSecretsKeyRing = ReadonlyMap<string, Buffer>

export type EncryptedApiKey = {
  ciphertext: string
  keyId: string
}

export type AiProviderSecretsConfig = {
  activeKeyId: string
  keyRing: AiProviderSecretsKeyRing
}

export type ReencryptApiKeyResult = EncryptedApiKey & {
  rotated: boolean
}

export type ApiKeyAtRest = {
  apiKeyCiphertext: string
  encryptionKeyId?: string | null
}

export type ApiKeyPersistenceFields = {
  apiKeyCiphertext: string
  encryptionKeyId: string
}

export type ReadStoredApiKeyResult = {
  plaintext: string
  persistence: ApiKeyPersistenceFields | null
}
