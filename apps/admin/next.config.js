import { withEnv } from '@repo/env';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  basePath: '/admin',
});

export default nextConfig;
