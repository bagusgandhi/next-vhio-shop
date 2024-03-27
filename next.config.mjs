/** @type {import('next').NextConfig} */
const nextConfig = {
    serverRuntimeConfig: {
        APP_ENV: process.env.APP_ENV,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        MIDTRANS_SERVERKEY: process.env.NEXT_MIDTRANS_SERVERKEY,
        MIDTRANS_URL: process.env.NEXT_MIDTRANS_URL,
        SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL
    },
    publicRuntimeConfig: {},
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
