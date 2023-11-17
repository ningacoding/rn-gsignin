---
id: 'index'
title: 'Module API'
sidebar_label: 'Reference'
custom_edit_url: null
displayed_sidebar: apiSidebar
---

## Constants

### statusCodes

• `Const` **statusCodes**: `Readonly`\<\{ `IN_PROGRESS`: `string` ; `NO_SAVED_CREDENTIAL_FOUND`: `string` ; `ONE_TAP_START_FAILED`: `string` ; `PLAY_SERVICES_NOT_AVAILABLE`: `string` ; `SIGN_IN_CANCELLED`: `string` ; `SIGN_IN_REQUIRED`: `string` }\>

#### Defined in

[src/errors/errorCodes.ts:16](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/errors/errorCodes.ts#L16)

## One-tap sign in module

### OneTapSignInParams

Ƭ **OneTapSignInParams**: `Object`

| Name                          | Type      | Description                                                                                                                                                                                                                           |
| ----------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `webClientId`                 | `string`  | The web client ID.                                                                                                                                                                                                                    |
| `nonce?`                      | `string`  | Optional. random string used by the ID token to prevent replay attacks.                                                                                                                                                               |
| `autoSignIn?`                 | `boolean` | Optional. If true, enables auto sign-in.                                                                                                                                                                                              |
| `filterByAuthorizedAccounts?` | `boolean` | Optional. [Filters by authorized accounts](<https://developers.google.com/android/reference/com/google/android/gms/auth/api/identity/BeginSignInRequest.GoogleIdTokenRequestOptions.Builder#setFilterByAuthorizedAccounts(boolean)>). |

[//]: # '| `passwordRequestSupported?`   | `boolean` | Optional. If true, supports password request. |'
[//]: # '| `idTokenRequestSupported?`    | `boolean` | Optional. If true, supports ID token request. |'

The following are available on the Web. [Read the value descriptions here](https://developers.google.com/identity/gsi/web/reference/js-reference).

| Name                                  | Type                                | Description |
| ------------------------------------- | ----------------------------------- | ----------- |
| `login_uri?`                          | `string`                            |             |
| `native_callback?`                    | `() => void`                        |             |
| `cancel_on_tap_outside?`              | `boolean`                           |             |
| `prompt_parent_id?`                   | `string`                            |             |
| `context?`                            | `"signin"` \| `"signup"` \| `"use"` |             |
| `state_cookie_domain?`                | `string`                            |             |
| `ux_mode?`                            | `"popup"` \| `"redirect"`           |             |
| `allowed_parent_origin?`              | `string` \| `string[]`              |             |
| `intermediate_iframe_close_callback?` | `() => void`                        |             |
| `itp_support?`                        | `boolean`                           |             |
| `log_level?`                          | `"debug"` \| `"info"` \| `"warn"`   |             |

#### Defined in

[src/oneTap/types.ts:12](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/oneTap/types.ts#L12)

---

### OneTapUser

Ƭ **OneTapUser**: `Object`

| Name               | Type                                                                                                                                       | Description                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| `user`             |                                                                                                                                            | The signed-in user object.                                            |
| `user.id`          | `string`                                                                                                                                   | The unique identifier of the user.                                    |
| `user.email`       | `string` \| `null`                                                                                                                         | The email of the user, if available.                                  |
| `user.name`        | `string` \| `null`                                                                                                                         | The full name of the user, if available.                              |
| `user.givenName`   | `string` \| `null`                                                                                                                         | The given name (first name) of the user, if available.                |
| `user.familyName`  | `string` \| `null`                                                                                                                         | The family name (last name) of the user, if available.                |
| `user.photo`       | `string` \| `null`                                                                                                                         | The URL to the user's photo, if available.                            |
| `idToken`          | `string` \| `null`                                                                                                                         | The ID token for the user. Present if `password` is `null`.           |
| `password`         | `string` \| `null`                                                                                                                         | The password for the user. Present if `idToken` is `null`.            |
| `credentialOrigin` | `"auto"` \| `"user"` \| `"user_1tap"` \| `"user_2tap"` \| `"btn"` \| `"btn_confirm"` \| `"btn_add_session"` \| `"btn_confirm_add_session"` | The origin of the credential selection. Always 'user' in native apps. |

#### Defined in

[src/oneTap/types.ts:24](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/oneTap/types.ts#L24)

---

### GoogleOneTapSignIn

• `Const` **GoogleOneTapSignIn**: `Object`

The entry point of the One-tap Sign In API, exposed as `GoogleOneTapSignIn`.

**`Param`**

`momentListener` Optional, only on Web. A callback function that is called when important events take place. [See reference.](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification)

#### Type declaration

| Name            | Type                                                                                                                                                                                       |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createAccount` | (`params`: [`OneTapSignInParams`](#onetapsigninparams), `momentListener?`: (`promptMomentNotification`: `PromptMomentNotification`) => `void`) => `Promise`\<[`OneTapUser`](#onetapuser)\> |
| `signIn`        | (`params`: [`OneTapSignInParams`](#onetapsigninparams), `momentListener?`: (`promptMomentNotification`: `PromptMomentNotification`) => `void`) => `Promise`\<[`OneTapUser`](#onetapuser)\> |
| `signOut`       | (`emailOrUniqueId`: `string`) => `Promise`\<`null`\>                                                                                                                                       |

#### Defined in

[src/oneTap/OneTapSignIn.ts:36](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/oneTap/OneTapSignIn.ts#L36)

## Original Google sign in

### AddScopesParams

Ƭ **AddScopesParams**: `Object`

#### Type declaration

| Name     | Type       | Description                                                               |
| :------- | :--------- | :------------------------------------------------------------------------ |
| `scopes` | `string`[] | The Google API scopes to request access to. Default is email and profile. |

#### Defined in

[src/types.ts:96](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/types.ts#L96)

---

### ConfigureParams

Ƭ **ConfigureParams**: `Object`

#### Type declaration

| Name                        | Type       | Description                                                                                                                                             |
| :-------------------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `webClientId?`              | `string`   | Web client ID from Developer Console. Required to get the `idToken` on the user object, and for offline access.                                         |
| `accountName?`              | `string`   | ANDROID ONLY. An account name that should be prioritized.                                                                                               |
| `forceCodeForRefreshToken?` | `boolean`  | ANDROID ONLY. If true, the granted server auth code can be exchanged for an access token and a refresh token.                                           |
| `hostedDomain?`             | `string`   | Specifies a hosted domain restriction                                                                                                                   |
| `offlineAccess?`            | `boolean`  | Must be true if you wish to access user APIs on behalf of the user from your own server                                                                 |
| `openIdRealm?`              | `string`   | iOS ONLY The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.           |
| `profileImageSize?`         | `number`   | iOS ONLY The desired height (and width) of the profile image. Defaults to 120px                                                                         |
| `scopes?`                   | `string`[] | The Google API scopes to request access to. Default is email and profile.                                                                               |
| `googleServicePlistPath?`   | `string`   | If you want to specify a different bundle path name for the GoogleService-Info, e.g. 'GoogleService-Info-Staging'. Mutualy exclusive with `iosClientId` |
| `iosClientId?`              | `string`   | If you want to specify the client ID of type iOS. Mutualy exclusive with `googleServicePlistPath`.                                                      |

#### Defined in

[src/types.ts:15](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/types.ts#L15)

---

### GetTokensResponse

Ƭ **GetTokensResponse**: `Object`

#### Type declaration

| Name          | Type     |
| :------------ | :------- |
| `accessToken` | `string` |
| `idToken`     | `string` |

#### Defined in

[src/types.ts:106](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/types.ts#L106)

---

### HasPlayServicesParams

Ƭ **HasPlayServicesParams**: `Object`

#### Type declaration

| Name                           | Type      | Description                                                                                                                |
| :----------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------- |
| `showPlayServicesUpdateDialog` | `boolean` | Optional. Whether to show a dialog that promps the user to install Google Play Services, if they don't have them installed |

#### Defined in

[src/types.ts:85](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/types.ts#L85)

---

### SignInParams

Ƭ **SignInParams**: `Object`

#### Type declaration

| Name         | Type     | Description                                                                                                                                                                                                                             |
| :----------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loginHint?` | `string` | iOS only. The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd) |

#### Defined in

[src/types.ts:4](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/types.ts#L4)

---

### User

Ƭ **User**: `Object`

#### Type declaration

| Name              | Type                                                                                                                                                                    | Description                                                                                |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| `idToken`         | `string` \| `null`                                                                                                                                                      | JWT (JSON Web Token) that serves as a secure credential for your user's identity.          |
| `scopes`          | `string`[]                                                                                                                                                              | -                                                                                          |
| `serverAuthCode`  | `string` \| `null`                                                                                                                                                      | Not null only if a valid webClientId and offlineAccess: true was specified in configure(). |
| `user`            | \{ `email`: `string` ; `familyName`: `string` \| `null` ; `givenName`: `string` \| `null` ; `id`: `string` ; `name`: `string` \| `null` ; `photo`: `string` \| `null` } | -                                                                                          |
| `user.email`      | `string`                                                                                                                                                                | -                                                                                          |
| `user.familyName` | `string` \| `null`                                                                                                                                                      | -                                                                                          |
| `user.givenName`  | `string` \| `null`                                                                                                                                                      | -                                                                                          |
| `user.id`         | `string`                                                                                                                                                                | -                                                                                          |
| `user.name`       | `string` \| `null`                                                                                                                                                      | -                                                                                          |
| `user.photo`      | `string` \| `null`                                                                                                                                                      | -                                                                                          |

#### Defined in

[src/types.ts:114](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/types.ts#L114)

---

### GoogleSignin

• `Const` **GoogleSignin**: `Object`

The entry point of the Google Sign In API, exposed as `GoogleSignin`.

#### Type declaration

| Name                     | Type                                                                                         |
| :----------------------- | :------------------------------------------------------------------------------------------- |
| `addScopes`              | (`options`: [`AddScopesParams`](#addscopesparams)) => `Promise`\<[`User`](#user) \| `null`\> |
| `clearCachedAccessToken` | (`tokenString`: `string`) => `Promise`\<`null`\>                                             |
| `configure`              | (`options`: [`ConfigureParams`](#configureparams)) => `void`                                 |
| `getCurrentUser`         | () => [`User`](#user) \| `null`                                                              |
| `getTokens`              | () => `Promise`\<[`GetTokensResponse`](#gettokensresponse)\>                                 |
| `hasPlayServices`        | (`options`: [`HasPlayServicesParams`](#hasplayservicesparams)) => `Promise`\<`boolean`\>     |
| `hasPreviousSignIn`      | () => `boolean`                                                                              |
| `revokeAccess`           | () => `Promise`\<`null`\>                                                                    |
| `signIn`                 | (`options`: [`SignInParams`](#signinparams)) => `Promise`\<[`User`](#user)\>                 |
| `signInSilently`         | () => `Promise`\<[`User`](#user)\>                                                           |
| `signOut`                | () => `Promise`\<`null`\>                                                                    |

#### Defined in

[src/signIn/GoogleSignin.ts:106](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/signIn/GoogleSignin.ts#L106)

## React Components

• **GoogleSigninButton**: `Object`

#### Defined in

[src/buttons/GoogleSigninButton.tsx:26](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/GoogleSigninButton.tsx#L26)

[src/buttons/GoogleSigninButton.tsx:55](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/GoogleSigninButton.tsx#L55)

[src/buttons/GoogleSigninButton.tsx:56](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/GoogleSigninButton.tsx#L56)

### GoogleSigninButtonProps

Ƭ **GoogleSigninButtonProps**: `Object`

#### Type declaration

Also inherits [ViewProps](https://reactnative.dev/docs/view#props).

| Name        | Type                  |
| :---------- | :-------------------- |
| `color?`    | `"dark"` \| `"light"` |
| `disabled?` | `boolean`             |
| `onPress?`  | () => `void`          |
| `size?`     | `number`              |

#### Defined in

[src/buttons/GoogleSigninButton.tsx:15](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/GoogleSigninButton.tsx#L15)

---

### WebGoogleSignInButtonProps

Ƭ **WebGoogleSignInButtonProps**: `Object`

| Name             | Type                                                                  | Description                                                |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------- |
| `webClientId`    | `string`                                                              | Required. The web client ID.                               |
| `onPress?`       | `() => void`                                                          | Optional. The function to call when the button is pressed. |
| `type?`          | `"standard"` \| `"icon"`                                              | Optional. The type of the sign-in button.                  |
| `theme?`         | `"outline"` \| `"filled_blue"` \| `"filled_black"`                    | Optional. The theme of the sign-in button.                 |
| `size?`          | `"large"` \| `"medium"` \| `"small"`                                  | Optional. The size of the sign-in button.                  |
| `text?`          | `"signin_with"` \| `"signup_with"` \| `"continue_with"` \| `"signin"` | Optional. The text to display on the sign-in button.       |
| `shape?`         | `"rectangular"` \| `"pill"` \| `"circle"` \| `"square"`               | Optional. The shape of the sign-in button.                 |
| `width?`         | `number`                                                              | Optional. The width of the sign-in button.                 |
| `locale?`        | `string`                                                              | Optional. The locale for the sign-in button.               |
| `logoAlignment?` | `"left"` \| `"center"`                                                | Optional. The alignment of the logo on the button.         |

#### Defined in

[src/buttons/WebGoogleSigninButton.tsx:7](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/WebGoogleSigninButton.tsx#L7)

---

### GoogleSigninButton

▸ **GoogleSigninButton**(`props`): `Element`

#### Parameters

| Name    | Type                                                  |
| :------ | :---------------------------------------------------- |
| `props` | [`GoogleSigninButtonProps`](#googlesigninbuttonprops) |

#### Returns

`Element`

#### Defined in

[src/buttons/GoogleSigninButton.tsx:26](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/GoogleSigninButton.tsx#L26)

---

### WebGoogleSigninButton

▸ **WebGoogleSigninButton**(`props`): `Element`

#### Parameters

| Name    | Type                                                        |
| :------ | :---------------------------------------------------------- |
| `props` | [`WebGoogleSignInButtonProps`](#webgooglesigninbuttonprops) |

#### Returns

`Element`

#### Defined in

[src/buttons/WebGoogleSigninButton.tsx:18](https://github.com/react-native-google-signin/google-signin/blob/322c98d/src/buttons/WebGoogleSigninButton.tsx#L18)
