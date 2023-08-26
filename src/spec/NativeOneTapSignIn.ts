import type { Spec } from './NativeOneTapSignIn.android';

const unsupportedPlatformError = new Error(
  'OneTapSignIn is now only available on Android',
);

export const OneTapNativeModule: Spec = {
  signIn(_params: Object): Promise<Object> {
    return Promise.reject(unsupportedPlatformError);
  },
  signOut(): Promise<null> {
    return Promise.reject(unsupportedPlatformError);
  },
};
