import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Anhar's Portfolio",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
  chains: [mainnet, sepolia],
  ssr: true,
  appDescription: "Anhar Fahrudin - Full-Stack & Web3 Engineer Portfolio",
  appUrl: "https://anharfhd.space",
  appIcon: "https://anharfhd.space/favicon.png",
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
});
