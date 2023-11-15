---
sidebar_position: 1
---

# Expo setup

### Prepare your Expo project

:::warning

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/). However, you can add custom native code to expo by following the guide below.

:::

```sh
npx expo install @react-native-google-signin/google-signin
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`.

Also, [obtain the config file](./get-config-file) and place it into your project. Specify the path to the file:

```json title="app.json"
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "plugins": ["@react-native-google-signin/google-signin"]
  }
}
```

### Rebuilding the app

Then run the following to generate the native project directories.

```sh
npx expo prebuild --clean
```

Next, rebuild your app and you're good to go!

```sh
npx expo run:android && npx expo run:ios
```

Read the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide for detailed information.
