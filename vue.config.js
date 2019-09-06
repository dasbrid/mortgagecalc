module.exports = {
    publicPath: '/Vue/mortgagecalc/',
    pwa: {
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
          swSrc: './src/service-worker.js',
          swDest: 'service-worker.js',
        },
      },
};
