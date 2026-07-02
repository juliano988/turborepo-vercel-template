import { withEnv } from '@repo/env';
import { getProxyRewrites } from '@repo/proxy';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv({
  async rewrites() {
    return getProxyRewrites();
  },
});

export default nextConfig;
