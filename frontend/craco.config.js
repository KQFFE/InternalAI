module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('@tailwindcss/postcss'),
      ],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext]',
        },
      });
      return webpackConfig;
    },
  },
};