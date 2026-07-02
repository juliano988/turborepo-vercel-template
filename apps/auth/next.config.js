import { withEnv } from '@repo/env';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  basePath: '/auth'
});

export default nextConfig;
