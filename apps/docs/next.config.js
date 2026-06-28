import { withEnv } from '@repo/env';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  basePath: '/docs',
});

export default nextConfig;
