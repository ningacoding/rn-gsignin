import type { Spec } from './NativeOneTapSignIn.android';

const unsupportedError = new Error('unsupported call');

export const OneTapNativeModule: Spec = {
  signIn(_params: Object): Promise<Object> {
    return Promise.reject(unsupportedError);
  },
  explicitSignIn(_params: Object): Promise<Object> {
    return Promise.reject(unsupportedError);
  },
  signOut(): Promise<null> {
    return Promise.reject(unsupportedError);
  },
};
