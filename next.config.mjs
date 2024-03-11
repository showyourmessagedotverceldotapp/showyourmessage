/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow images from anywhere
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
