const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  images: {
    domains: isProd ? ['api.rechcaminhoes.com.br'] : ['localhost', '127.0.0.1'],
  },
};

export default nextConfig;
