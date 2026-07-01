import { withEnv } from '@repo/env';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  assetPrefix: '/auth'
});

export default nextConfig;
