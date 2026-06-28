import { withEnv } from '@repo/env';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = withEnv({
  reactStrictMode: true,
  basePath: '/docs',
});

export default withMDX(config);
