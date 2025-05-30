const nextConfig = {
  images: {
    domains:
      process.env.NODE_ENV === 'production'
        ? ['oficina-demo.fly.dev']
        : ['localhost', '127.0.0.1'],
  },

};

export default nextConfig;
