// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '**',
            },
        ],
    },
    eslint: {
        // CI already runs `npm run lint`; skipping during `next build` avoids build-time ESLint serialization issues.
        ignoreDuringBuilds: true,
    },
    env: {
        // Prevent build-time Invalid URL crashes when CI secrets are missing/empty.
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "ci-fallback-secret",
    },
};

export default nextConfig;