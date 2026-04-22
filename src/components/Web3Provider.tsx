"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, arbitrumSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import { injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fcc6bba6f1de962d911bb5b5c3dba68";

const config = createConfig({
  chains: [arbitrumSepolia, mainnet],
  connectors: [
    walletConnect({ projectId, showQrModal: true }),
    injected(),
  ],
  transports: {
    [arbitrumSepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

export function Web3Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
