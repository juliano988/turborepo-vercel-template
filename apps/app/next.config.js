import { withEnv } from '@repo/env';
import { withBasePath } from '@repo/proxy';

/** @type {import('next').NextConfig} */
const nextConfig = withEnv(withBasePath('app'));

export default nextConfig;
