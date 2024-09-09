/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Set up the proxy
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*', // Proxy requests starting with /api
    //             destination: 'https://wordpress-977541-4859975.cloudwaysapps.com/:path*', // Proxy to your WordPress backend
    //         },
    //     ];
    // },
};

export default nextConfig;
