module.exports = function (api) {
  api.cache(true);
  // O babel-preset-expo já inclui tudo o que o app precisa
  return { presets: ['babel-preset-expo'] };
};
