// Complementa o app.json. Para publicar o site em uma subpasta (como no
// GitHub Pages), defina EXPO_BASE_URL no build, por exemplo:
//   EXPO_BASE_URL=/Nexo npm run build:web
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;
  if (!baseUrl) return config;
  return { ...config, experiments: { ...config.experiments, baseUrl } };
};
