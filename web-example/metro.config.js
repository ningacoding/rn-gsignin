const path = require('path');
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('@expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
  'react-native-web': '_', // to make metro search for RNW in web-example/node_modules
});

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig,

  // projectRoot: __dirname,
  watchFolders: [root],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'mjs', 'cjs'],

    blockList: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`),
      ),
    ),
    resolverMainFields: [
      'source',
      ...defaultConfig.resolver.resolverMainFields,
    ],

    extraNodeModules: modules.reduce(
      (acc, name) => {
        acc[name] = path.join(__dirname, 'node_modules', name);
        return acc;
      },
      {
        '@react-native-google-signin/google-signin': root,
      },
    ),
  },
};

module.exports = config;
