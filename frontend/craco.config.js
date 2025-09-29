module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return webpackConfig;
    },
  },
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    // Remove deprecated properties
    delete devServerConfig.onAfterSetupMiddleware;
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.https;

    // Use the new setupMiddlewares instead
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      return middlewares;
    };

    // Use the new server config format if HTTPS was needed
    if (env === 'development') {
      devServerConfig.server = 'http';
    }

    return devServerConfig;
  },
};