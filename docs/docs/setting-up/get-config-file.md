---
sidebar_position: 15
---

# Obtaining configuration information

Please NOTE that you **do not** need firebase to configure Google Sign In. However, if you use Firebase, it's a little easier to set up the sign in experience because Firebase gives you one file to download and put into your project.

For Expo, we currently document only the procedure with Firebase, where you download a configuration file from Firebase.

## Without Firebase

### iOS

You need to obtain the `ios client id` and `reversed client id`.

Follow the instructions at ["Get an OAuth client ID"](https://developers.google.com/identity/sign-in/ios/start-integrating#get_an_oauth_client_id) and then ["Configure your application project"](https://developers.google.com/identity/sign-in/ios/start-integrating#configure_app_project).

### Android

Follow the instructions at ["Configure a Google API Console project"](https://developers.google.com/identity/sign-in/android/start#configure-a-google-api-console-project).

## WebClientId

`webClientId` can be found [here](https://console.developers.google.com/apis/credentials).
Make sure you select the correct project. `webClientId` should be under OAuth section.

## With Firebase (and Expo)

If you're using Expo EAS, read [credentials docs](https://docs.expo.dev/app-signing/managed-credentials/#inspecting-credentials-configuration) to learn how to obtain information for step 2.

If you don't already have a project in Firebase you need to create one in order to add credentials for your iOS and Android application.

[Firebase console](https://console.firebase.google.com/u/0/)

### 1. Add your iOS and Android App inside Project settings (see image).

![Project settings](/img/project-settings.png)

### 2. Enter required information and download the config file.

_Note: For Android, adding the SHA1 hash is an obligation_

You can use your debug keystore's SHA1 hash, read this [StackOverflow thread](https://stackoverflow.com/questions/15727912/sha-1-fingerprint-of-keystore-certificate) to obtain it. When running the `keytool` command, **MAKE SURE** you provide path to the correct keystore, you may have multiple keystores on your system! (eg in home directory, and also directly in the `android/app` folder). To see what keystore is being used to sign your app, go to `android/app/build.gradle` and look for `storeFile` entries.

If you don't have a keystore, you need to generate one. To generate your keystore follow [this guide](https://facebook.github.io/react-native/docs/signed-apk-android.html).

**IMPORTANT** if you have multiple keystores (and you likely do - eg. debug and release) you'll need to get the SHA1 hashes for all of them and save the hashes to Firebase!
