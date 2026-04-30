export const USDC_ADDRESS         = (process.env.NEXT_PUBLIC_USDC_ADDRESS          ?? "") as `0x${string}`;
export const WRAPPED_USDC_ADDRESS = (process.env.NEXT_PUBLIC_WRAPPED_USDC_ADDRESS   ?? "") as `0x${string}`;

// ── ERC-20 (Circle USDC) ───────────────────────────────────────────────────────
export const ERC20_ABI = [
  { name: "balanceOf",  type: "function", stateMutability: "view",       inputs: [{ name: "account", type: "address" }],                               outputs: [{ type: "uint256" }] },
  { name: "allowance",  type: "function", stateMutability: "view",       inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "approve",    type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "decimals",   type: "function", stateMutability: "view",       inputs: [],                                                                   outputs: [{ type: "uint8" }] },
] as const;

// ── WrappedConfidentialUSDC (ERC7984 + ERC20ToERC7984Wrapper) ─────────────────
// euint256 / externalEuint256 are represented as bytes32 in ABI encoding.
export const WRAPPED_USDC_ABI = [
  // View
  { name: "confidentialBalanceOf", type: "function", stateMutability: "view",       inputs: [{ name: "account", type: "address" }],                                     outputs: [{ name: "", type: "bytes32" }] },
  { name: "inferredTotalSupply",   type: "function", stateMutability: "view",       inputs: [],                                                                         outputs: [{ type: "uint256" }] },
  { name: "unwrapRequester",       type: "function", stateMutability: "view",       inputs: [{ name: "unwrapAmount", type: "bytes32" }],                                 outputs: [{ type: "address" }] },
  { name: "underlying",            type: "function", stateMutability: "view",       inputs: [],                                                                         outputs: [{ type: "address" }] },
  { name: "decimals",              type: "function", stateMutability: "view",       inputs: [],                                                                         outputs: [{ type: "uint8" }] },
  // Write
  { name: "wrap",                  type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],     outputs: [{ name: "", type: "bytes32" }] },
  // unwrap with inputProof (externalEuint256 = bytes32, inputProof = bytes)
  { name: "unwrap",                type: "function", stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to",   type: "address" },
      { name: "encryptedAmount", type: "bytes32" },
      { name: "inputProof",      type: "bytes" },
    ],
    outputs: [{ name: "unwrapRequestId", type: "bytes32" }],
  },
  { name: "finalizeUnwrap",        type: "function", stateMutability: "nonpayable",
    inputs: [
      { name: "unwrapRequestId",        type: "bytes32" },
      { name: "decryptedAmountAndProof", type: "bytes" },
    ],
    outputs: [],
  },
  // Events
  { name: "UnwrapRequested", type: "event", inputs: [{ indexed: true, name: "receiver", type: "address" }, { indexed: false, name: "amount", type: "bytes32" }] },
  { name: "UnwrapFinalized", type: "event", inputs: [{ indexed: true, name: "receiver", type: "address" }, { indexed: false, name: "encryptedAmount", type: "bytes32" }, { indexed: false, name: "plaintextAmount", type: "uint256" }] },
] as const;
