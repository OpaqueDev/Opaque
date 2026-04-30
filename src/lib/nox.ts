/**
 * nox.ts — @iexec-nox/handle SDK wrapper (client-side only)
 *
 * Three operations:
 *   createNoxClient      — init HandleClient from viem WalletClient
 *   encryptAmount        — plaintext bigint → { handle, handleProof } for contract calls
 *   decryptBalance       — encrypted handle (from confidentialBalanceOf) → plaintext bigint
 *   publicDecryptHandle  — publicly-decryptable handle → { value, decryptionProof }
 */

import type { WalletClient } from "viem";

export type NoxClient = Awaited<ReturnType<typeof createNoxClient>>;

export async function createNoxClient(walletClient: WalletClient) {
  const { createViemHandleClient } = await import("@iexec-nox/handle");
  return createViemHandleClient(walletClient);
}

export async function encryptAmount(
  client: NoxClient,
  amount: bigint,
  contractAddress: `0x${string}`
): Promise<{ handle: `0x${string}`; handleProof: `0x${string}` }> {
  const { handle, handleProof } = await client.encryptInput(amount, "uint256", contractAddress);
  return {
    handle:      handle      as `0x${string}`,
    handleProof: handleProof as `0x${string}`,
  };
}

// Decrypt user's own confidential balance (requires wallet signature to prove ACL access)
export async function decryptBalance(
  client: NoxClient,
  handle: `0x${string}`
): Promise<bigint> {
  const { value } = await (client as any).decrypt(handle);
  return BigInt(value as string | number);
}

// Publicly decrypt a handle that was marked with allowPublicDecryption (unwrapRequestId)
export async function publicDecryptHandle(
  client: NoxClient,
  handle: `0x${string}`
): Promise<{ value: bigint; decryptionProof: `0x${string}` }> {
  const { value, decryptionProof } = await (client as any).publicDecrypt(handle);
  return {
    value:           BigInt(value as string | number),
    decryptionProof: decryptionProof as `0x${string}`,
  };
}
