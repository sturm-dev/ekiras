module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          _assets: './src/assets',
          // -----
          _atoms: './src/components/atoms',
          _molecules: './src/components/molecules',
          _organisms: './src/components/organisms',
          _componentsForThisApp: './src/components/components-for-this-app',
          // -----
          _navigations: './src/navigations',
          // -----
          _scenes: './src/scenes',
          // -----
          _utils: './src/utils',
          // -----
          _db: './src/db',
          // -----
          _hooks: './src/hooks',
        },
      },
    ],
    ['module:react-native-dotenv', {moduleName: 'react-native-dotenv'}],
  ],
};
