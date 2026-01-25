import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, base, polygon } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
    chains: [mainnet, sepolia, base, polygon],
    connectors: [
        injected({ target: 'metaMask' }),
        injected({ target: 'phantom' }),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [base.id]: http(),
        [polygon.id]: http(),
    },
})
