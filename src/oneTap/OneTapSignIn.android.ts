import { OneTapNativeModule } from '../spec/NativeOneTapSignIn';
import { OneTapSignInModule, OneTapUser } from './types';
import {
  validateWebClientId,
  validateWebClientIdAndApiUsage,
} from './validateWebClientId';

const signIn: OneTapSignInModule['signIn'] = (
  params,
  callbacks,
): Promise<OneTapUser> => {
  validateWebClientIdAndApiUsage(params, callbacks);

  return OneTapNativeModule.signIn({
    autoSignIn: true,
    filterByAuthorizedAccounts: true,
    ...params,
  });
};

const presentExplicitSignIn: OneTapSignInModule['presentExplicitSignIn'] = (
  params,
  callbacks,
): Promise<OneTapUser> => {
  validateWebClientIdAndApiUsage(params, callbacks);
  return OneTapNativeModule.explicitSignIn(params);
};

const createAccount: OneTapSignInModule['createAccount'] = (
  params,
  callbacks,
): Promise<OneTapUser> => {
  validateWebClientIdAndApiUsage(params, callbacks);
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
  params?.offlineAccess && validateWebClientId(params.offlineAccess);

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

export const GoogleOneTapSignIn = {
  signIn,
  createAccount,
  signOut,
  presentExplicitSignIn,
  requestAuthorization,
} satisfies OneTapSignInModule;
