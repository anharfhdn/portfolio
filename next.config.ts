import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: '**' },
            { protocol: 'http', hostname: '**' },
        ],
    },
    output: 'standalone',
    typescript: { ignoreBuildErrors: false },
    eslint: { ignoreDuringBuilds: false },

    turbopack: {
        rules: {
            "*.{jsx,tsx}": {
                loaders: [LOADER]
            }
        }
    },

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },
};

export default nextConfig;