/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'sa-east-1.graphassets.com',
            },
            {
              protocol: 'https',
              hostname: 'img.clerk.com',
            },
          ],
    }
};

export default nextConfig;
