/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"],
  },
  reactStrictMode: true,
  // other configurations
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
    }
    return config
  },
}

export default nextConfig
