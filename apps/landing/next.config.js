import { withEnv } from '@repo/env';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  async rewrites() {
    return [
      {
        source: '/app',
        destination: `${process.env.NEXT_PUBLIC_APP_URL}/app`,
      },
      {
        source: '/app/:path*',
        destination: `${process.env.NEXT_PUBLIC_APP_URL}/app/:path*`,
      },
      {
        source: '/admin',
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin`,
      },
      {
        source: '/admin/:path*',
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/:path*`,
      },
      {
        source: '/docs',
        destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs`,
      },
      {
        source: '/docs/:path*',
        destination: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs/:path*`,
      },
      {
        source: '/login',
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/login`,
      },
      {
        source: '/register',
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/register`,
      },
      {
        source: '/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/:path*`,
      },
    ];
  },
});

export default nextConfig;
