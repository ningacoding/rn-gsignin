import { OneTapNativeModule } from '../spec/NativeOneTapSignIn';
import { OneTapSignInModule, OneTapUser } from './types';

const signIn: OneTapSignInModule['signIn'] = (params): Promise<OneTapUser> => {
  return OneTapNativeModule.signIn({
    autoSignIn: true,
    filterByAuthorizedAccounts: true,
    ...params,
  });
};

const presentExplicitSignIn: OneTapSignInModule['presentExplicitSignIn'] = (
  params,
): Promise<OneTapUser> => {
  return OneTapNativeModule.explicitSignIn(params);
};

const createAccount: OneTapSignInModule['createAccount'] = (
  params,
): Promise<OneTapUser> => {
  return OneTapNativeModule.signIn({
    autoSignIn: false,
    filterByAuthorizedAccounts: false,
    ...params,
  });
};

const signOut: OneTapSignInModule['signOut'] = () => {
  // make sure no params are passed to the native module
  // because native module doesn't expect any
  return OneTapNativeModule.signOut();
};

const requestAuthorization: OneTapSignInModule['requestAuthorization'] = async (
  params,
) => {
  // android might only return the scopes that we asked for, not those that were already granted
  const authResultPromise = OneTapNativeModule.requestAuthorization({
    scopes: params.scopes,
    hostedDomain: params?.hostedDomain,
    webClientId: params?.offlineAccess?.webClientId,
    forceCodeForRefreshToken:
      params?.offlineAccess?.forceCodeForRefreshToken === true,
    accountName: params?.accountName,
  });
  const authResult = await authResultPromise;
  return authResult;
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
  requestAuthorization,
} satisfies OneTapSignInModule;
