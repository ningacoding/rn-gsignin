import { OneTapNativeModule } from '../spec/NativeOneTapSignIn';
import type { OneTapSignInModule, OneTapUser } from './types';

const signIn: OneTapSignInModule['signIn'] = (params): Promise<OneTapUser> => {
  return OneTapNativeModule.signIn({
    autoSignIn: true,
    filterByAuthorizedAccounts: true,
    ...params,
  }) as Promise<OneTapUser>;
};
const presentExplicitSignIn: OneTapSignInModule['presentExplicitSignIn'] = (
  params,
): Promise<OneTapUser> => {
  return OneTapNativeModule.explicitSignIn({
    autoSignIn: true,
    filterByAuthorizedAccounts: true,
    ...params,
  }) as Promise<OneTapUser>;
};
const createAccount: OneTapSignInModule['createAccount'] = (
  params,
): Promise<OneTapUser> => {
  return OneTapNativeModule.signIn({
    autoSignIn: false,
    filterByAuthorizedAccounts: false,
    ...params,
  }) as Promise<OneTapUser>;
};

const signOut: OneTapSignInModule['signOut'] = () => {
  // make sure no params are passed to the native module
  return OneTapNativeModule.signOut();
};

/**
 * The entry point of the One-tap Sign In API, exposed as `GoogleOneTapSignIn`. On Android, this module uses the [Android Credential Manager](https://developers.google.com/identity/android-credential-manager) under the hood.
 *
 * On the web, don't call `signIn` / `createAccount` and use the `WebGoogleOneTapSignIn.signIn` instead. The `signOut` method is available on all platforms.
 * @group One-tap sign in module
 * */
export const GoogleOneTapSignIn = {
  signIn,
  createAccount,
  signOut,
  presentExplicitSignIn,
} satisfies OneTapSignInModule;
