import {
  CreateSecretCommand,
  GetSecretValueCommand,
  type GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";

export const createSecretsManagerClient = (): SecretsManagerClient => {
  return new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
  });
};

export async function getSecretValue(
  secretName: string
): Promise<GetSecretValueCommandOutput> {
  const client = createSecretsManagerClient();
  return await client.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    } as GetSecretValueCommandInput)
  );
}

export async function upSertSecrets(
  SecretName: string,
  SecretValue: Record<string, unknown>
): Promise<void> {
  const client = createSecretsManagerClient();

  try {
    await client.send(
      new CreateSecretCommand({
        Name: SecretName,
        SecretString: JSON.stringify(SecretValue),
      })
    );
  } catch (error) {
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: SecretName,
          SecretString: JSON.stringify(SecretValue),
        })
      );
    } else {
      throw error;
    }
  }
}

export function parseSecretString<T = Record<string, unknown>>(
  secret: GetSecretValueCommandOutput
): T | null {
  if (!secret.SecretString) {
    return null;
  }
  try {
    return JSON.parse(secret.SecretString) as T;
  } catch (error) {
    console.error("Failed to parse secret string:", error);
    return null;
  }
}
