import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    metaMask({
      dappMetadata: {
        name: "Anhar's Portfolio",
        url: typeof window !== "undefined" ? window.location.origin : "",
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
});
