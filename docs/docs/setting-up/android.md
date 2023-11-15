---
sidebar_position: 3
---

# Android setup guide

:::warning
This applies to vanilla React Native apps, not Expo.
:::

### 1. Google project configuration

- Follow [this](./get-config-file.md) guide to get the configuration information.

#### 1.a - if you're using Firebase

- Place the generated configuration file (`google-services.json`) into project according to [this guide](https://developers.google.com/android/guides/google-services-plugin#adding_the_json_file).

Please see [more details here](https://support.google.com/cloud/answer/6158849#installedapplications&android) if needed.
It's important that OAuth 2.0 android id has fingerprint set correspondingly to the fingerprint of certificate which is used to sign the apk. Also, package name should be the same as apk package name.

### 2. Installation

1 . Update `android/build.gradle` with

```groovy title="android/build.gradle"
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33
        // highlight-next-line
        googlePlayServicesAuthVersion = "19.2.0" // <--- use this version or newer
    }
// ...
    dependencies {
        // highlight-start
        classpath 'com.google.gms:google-services:4.4.0' // <--- use this version or newer
        // highlight-end
    }
}
```

2 . Update `android/app/build.gradle` with

```groovy title="android/app/build.gradle"
dependencies {
    implementation fileTree(dir: "libs", include: ["*.jar"])
    implementation "com.facebook.react:react-native:+"
}

// highlight-next-line
apply plugin: 'com.google.gms.google-services' // <--- this should be the last line
```

#### Choose Dependency versions (optional)

The library depends on `com.google.android.gms:play-services-auth`, as seen in [build.gradle](https://github.com/react-native-community/google-signin/blob/master/android/build.gradle). If needed, you may control their versions by the `ext` closure, as seen in [build.gradle](https://github.com/react-native-community/google-signin/blob/master/example/android/build.gradle) of the example app.

### 3. Running on simulator

Make sure you have a simulator with Google Play Services installed.

To ensure best performance, you should have [HW acceleration](https://developer.android.com/studio/run/emulator-acceleration#accel-vm) working.

### Running on device

Nothing special here, as long as you run your app on an Android device with Google Play Services installed.
