# WebGoogleSigninButton

This is the sign in button that you can use in Web apps. It renders `null` when used in native apps.
It has a slightly different API than the native `GoogleSigninButton` component which is why it exists as a separate component.

:::tip
Please note that Web support is only available to sponsors️. [It takes just a few clicks to get access](/docs/install.mdx#accessing-the-new-package-for-sponsors) ❤️.
:::

The button will _not render_ before the [Google Client API has been loaded](../setting-up/web). You can use the `onError` prop to detect this case.

```tsx
import { WebGoogleSigninButton } from '@react-native-google-signin/google-signin';

<WebGoogleSigninButton
  webClientId={config.webClientId}
  onPress={() => {
    // initiate sign in
  }}
/>;
```

## Props

| Name             | Type                                                                  | Description                                                                         |
| ---------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `webClientId`    | `string`                                                              | Required. The web client ID.                                                        |
| `onPress?`       | `() => void`                                                          | Optional. The function to call when the button is pressed.                          |
| `type?`          | `"standard"` \| `"icon"`                                              | Optional. The type of the sign-in button.                                           |
| `theme?`         | `"outline"` \| `"filled_blue"` \| `"filled_black"`                    | Optional. The theme of the sign-in button.                                          |
| `size?`          | `"large"` \| `"medium"` \| `"small"`                                  | Optional. The size of the sign-in button.                                           |
| `text?`          | `"signin_with"` \| `"signup_with"` \| `"continue_with"` \| `"signin"` | Optional. The text to display on the sign-in button.                                |
| `shape?`         | `"rectangular"` \| `"pill"` \| `"circle"` \| `"square"`               | Optional. The shape of the sign-in button.                                          |
| `width?`         | `number`                                                              | Optional. The width of the sign-in button.                                          |
| `locale?`        | `string`                                                              | Optional. The locale for the sign-in button.                                        |
| `logoAlignment?` | `"left"` \| `"center"`                                                | Optional. The alignment of the logo on the button.                                  |
| `onError?`       | `(error: Error) => void`                                              | Optional. Called when you try to render the button before the Client SDK is loaded. |
