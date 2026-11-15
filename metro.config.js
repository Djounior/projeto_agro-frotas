const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Necessário para o Firebase JS SDK resolver arquivos .cjs
config.resolver.sourceExts.push('cjs');

module.exports = config;