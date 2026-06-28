import { withEnv } from '@repo/env';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  basePath: '/app',
});

export default nextConfig;
