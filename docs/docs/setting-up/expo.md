---
sidebar_position: 1
---

# Expo setup

### Prepare your Expo project

:::warning

This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/). However, you can add custom native code to expo by following the guide below.

Read Expo's ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide for detailed information.

:::

```sh
npx expo install @react-native-google-signin/google-signin
```

After installing this npm package, add the provided [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`.

#### Expo without Firebase

If you're _not_ using Firebase, provide the `iosUrlScheme` option to the config plugin.

To obtain `iosUrlScheme`, go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and copy the "iOS URL scheme" from your iOS client in the "OAuth 2.0 Client IDs" section. Note that the config plugin that works without Firebase is only [available to sponsors](../install.mdx#accessing-the-new-package-for-sponsors) of this module.

```json title="app.json"
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps._some_id_here_"
        }
      ]
    ]
  }
}
```

#### Expo and Firebase

With Firebase, [obtain the config file](./get-config-file) and place it into your project. Then specify the path to the file:

```json title="app.json"
{
  "expo": {
    "plugins": ["@react-native-google-signin/google-signin"],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
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
