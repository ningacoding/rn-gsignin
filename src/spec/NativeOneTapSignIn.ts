import type { Spec } from './NativeOneTapSignIn.android';

const unsupportedError = new Error('unsupported call');

export const OneTapNativeModule: Spec = {
  signIn(_params: Object) {
    return Promise.reject(unsupportedError);
  },
  explicitSignIn(_params: Object) {
    return Promise.reject(unsupportedError);
  },
  signOut(): Promise<null> {
    return Promise.reject(unsupportedError);
  },
  requestAuthorization() {
    return Promise.reject(unsupportedError);
  },
};
