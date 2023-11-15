---
sidebar_position: 60
---

# Error handling

```ts
import { statusCodes } from '@react-native-google-signin/google-signin';
```

Status codes are useful when determining which kind of error has occurred during the sign in process. Under the hood, these constants are derived from native GoogleSignIn error codes and are platform-specific. Always compare `error.code` to `statusCodes.*` and do not rely on raw value of `error.code`.

See [example usage](original#signin).

| Name                          | Description                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SIGN_IN_CANCELLED`           | When user cancels the sign in flow                                                                                                                                                                                                                                                                                                                                          |
| `IN_PROGRESS`                 | Trying to invoke another operation (e.g. `signInSilently`) when previous one has not yet finished. If you call e.g. `signInSilently` twice, 2 calls to `signInSilently` in the native module will be done. The promise from the first call to `signInSilently` will be rejected with this error, and the second will resolve / reject with the result of the native module. |
| `SIGN_IN_REQUIRED`            | Useful for use with `signInSilently()` - no user has signed in yet                                                                                                                                                                                                                                                                                                          |
| `PLAY_SERVICES_NOT_AVAILABLE` | Play services are not available or outdated. This happens on Android, or on the Web when you're calling the exposed APIs [before the Client library is loaded](setting-up/web).                                                                                                                                                                                             |

## One-tap specific errors

| Name                        | Description                                                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ONE_TAP_START_FAILED`      | Thrown when the One-tap sign in UI cannot be presented.                                                                                                                       |
| `NO_SAVED_CREDENTIAL_FOUND` | Thrown when no user signed in to your app. Also can happen during the [cooldown period](https://developers.google.com/identity/gsi/web/guides/features#exponential_cooldown). |

[Example how to use `statusCodes`](#signin).
