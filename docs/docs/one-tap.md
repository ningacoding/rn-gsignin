---
sidebar_position: 30
sidebar_class_name: onetap
---

# One-tap Google sign in

This is the easiest and recommended way to implement Google Sign In. It is a one-tap sign in flow that requires very little user interaction, thus increasing conversions. It is available on Android, iOS and Web.

:::tip
Please note this module is [only available to sponsors️](install) ❤️
:::

For detailed documentation, you can read the original docs for [Android](https://developers.google.com/identity/one-tap/android/overview) and for [Web](https://developers.google.com/identity/gsi/web/guides/offerings#one_tap). On iOS, the provided API is a wrapper of the [iOS Google Sign In SDK](https://developers.google.com/identity/sign-in/ios/start-integrating).

Note that on iOS and Android, you can combine the one-tap methods with those one from the [Original Google Sign In](original), i.e. you can use the One Tap sign in to sign in the user. Then call `signInSilently()` and then (for example) `getCurrentUser()` to get the user data.

```ts
import {
  GoogleOneTapSignIn,
  statusCodes,
  type OneTapUser,
} from '@react-native-google-signin/google-signin';
```

### `signIn`

signature: (`params`: [`OneTapSignInParams`](api#onetapsigninparams), `momentListener?`: (`promptMomentNotification`: `PromptMomentNotification`) => `void`) => `Promise`\<[`OneTapUser`](api#onetapuser)\>

Attempts to sign in user automatically as explained [here](<https://developers.google.com/android/reference/com/google/android/gms/auth/api/identity/BeginSignInRequest.Builder#setAutoSelectEnabled(boolean)>).

Returns a `Promise` that resolves with an object containing the user data or rejects in case of error.

Optionally, you can provide a `momentListener` callback function. The callback that is called only on Web when important events take place. [See reference.](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification)

```ts
import {
  GoogleOneTapSignIn,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Somewhere in your code
signIn = async () => {
  try {
    const userInfo = await GoogleOneTapSignIn.signIn({
      webClientId: config.webClientId,
      nonce: 'your_nonce',
    });
    setState({ userInfo });
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
    } else if (error.code === statusCodes.ONE_TAP_START_FAILED) {
      // starting the one tap dialog failed
    } else if (error.code === statusCodes.NO_SAVED_CREDENTIAL_FOUND) {
      // No saved credentials found. Launch the One Tap sign-up flow (use GoogleOneTapSignIn.signUp)
      // or do nothing and continue presenting the signed-out UI.
    } else {
      // some other error happened
    }
  }
};
```

### `createAccount`

signature: (`params`: [`OneTapSignInParams`](api#onetapsigninparams), `momentListener?`: (`promptMomentNotification`: `PromptMomentNotification`) => `void`) => `Promise`\<[`OneTapUser`](api#onetapuser)\>

Starts a flow to create a user account. It will offer the user a list of the accounts to choose from (When multiple Google accounts are logged in on the device). Also, it can be used if `signIn` rejects with `NO_SAVED_CREDENTIAL_FOUND` error, as shown in the code snippet above.

Returns a `Promise` that resolves with an object containing the user data or rejects in case of error.

Optionally, you can provide a `momentListener` callback function. The callback that is called only on Web when important events take place. [See reference.](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification)

```ts
await GoogleOneTapSignIn.createAccount({
  webClientId: config.webClientId,
  nonce: 'your_nonce',
});
```

### `signOut`

signature: (`emailOrUniqueId`: `string`) => `Promise`\<`null`\>

Signs out the current user. On the web, you need to provide the `id` or email of the user. On Android and iOS, this parameter does not have any effect.

Returns a Promise that resolves with `null` or rejects in case of error.

```ts
await GoogleOneTapSignIn.signOut(user.id);
```
