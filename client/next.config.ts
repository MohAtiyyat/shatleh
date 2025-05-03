import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'images.pexels.com', '127.0.0.1'], // Add '127.0.0.1' here
  },
};

export default withNextIntl(nextConfig);