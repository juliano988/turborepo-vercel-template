import { withEnv } from '@repo/env';
import { withBasePath } from '@repo/proxy';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = withEnv(withBasePath('docs', { reactStrictMode: true }));

export default withMDX(config);
