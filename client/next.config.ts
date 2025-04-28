import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost' , 'images.pexels.com'], // Allow images from localhost (port 5000 is inferred)
    
    
  },
};

export default withNextIntl(nextConfig);