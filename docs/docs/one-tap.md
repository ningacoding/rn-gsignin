---
sidebar_position: 30
sidebar_class_name: onetap
---

# One-tap Google sign in

This is the easiest and recommended way to implement Google Sign In. It is a one-tap sign in flow that requires very little user interaction, thus increasing conversions. It is available on Android, iOS and Web.

It is built on top of the [Android Credential Manager](https://developers.google.com/identity/android-credential-manager) and [One Tap](https://developers.google.com/identity/gsi/web/guides/offerings#one_tap) on the Web. On iOS, the provided API is a wrapper of the [iOS Google Sign In SDK](https://developers.google.com/identity/sign-in/ios/start-integrating).

:::tip
Please note this functionality is only available to sponsors️. [It takes just a few clicks to get access](install#accessing-the-new-package-for-sponsors) ❤️.
:::

Note that on iOS and Android, you can combine the one-tap methods with those one from the [Original Google Sign In](original). To do that, use the One-tap sign in to sign in the user. Then call `signInSilently()` and then (for example) `getCurrentUser()` to get the current user's information.

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

Returns a `Promise` that resolves with an object containing the user data or rejects in case of error. If there is no user that previously signed in, the promise will reject with [`NO_SAVED_CREDENTIAL_FOUND`](http://localhost:3000/docs/errors#one-tap-specific-errors) error. In that case, you can call [`createAccount`](one-tap#createaccount) to start a flow to create a new account.

Optionally, you can provide a `momentListener` callback function. The callback is called only on Web when important events take place. [See reference.](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification)

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
      iosClientId: config.iosClientId, // only needed if you're not using Firebase config file
      nonce: 'your_nonce',
    });
    setState({ userInfo });
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.NO_SAVED_CREDENTIAL_FOUND:
          // no saved credential found, try creating an account
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          break;
        case statusCodes.ONE_TAP_START_FAILED:
          // Android and Web only, you probably have hit rate limiting. You can still call the original Google Sign In API in this case.
          break;
        default:
        // something else happened
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
};
```

### `createAccount`

signature: (`params`: [`OneTapSignInParams`](api#onetapsigninparams), `momentListener?`: (`promptMomentNotification`: `PromptMomentNotification`) => `void`) => `Promise`\<[`OneTapUser`](api#onetapuser)\>

Starts a flow to create a user account. It offers a list of user accounts to choose from (When multiple Google accounts are logged in on the device). Also, it can be used if `signIn` rejects with `NO_SAVED_CREDENTIAL_FOUND` error, as shown in the code snippet above.

Returns a `Promise` that resolves with an object containing the user data or rejects in case of error.

Optionally, you can provide a `momentListener` callback function. The callback is called only on Web when important events take place. [See reference.](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification)

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
