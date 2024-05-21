import type { OneTapSignInModule, OneTapUser } from './types';
import { GoogleSignin } from '../signIn/GoogleSignin';
import { isErrorWithCode } from '@react-native-google-signin/google-signin';
import {
  ios_only_SCOPES_ALREADY_GRANTED,
  statusCodes,
} from '../errors/errorCodes';

function throwNoIdToken(callSite: string): never {
  // this prob never happens
  const e = new Error(`No idToken present in the ${callSite} response`);
  // the docs say that the errors produced by the module should have a code property
  Object.assign(e, { code: 'ID_TOKEN_EXPECTED' });
  throw e;
}

const signInSilently: OneTapSignInModule['signIn'] = async (params) => {
  GoogleSignin.configure(params);
  try {
    const { user, idToken, serverAuthCode } =
      await GoogleSignin.signInSilently();
    if (!idToken) {
      throwNoIdToken('signInSilently');
    }
    const oneTapUser: OneTapUser = {
      user,
      idToken,
      serverAuthCode,
      // credentialOrigin is not available on the iOS side and is added for compatibility with Web
      credentialOrigin: 'user',
    };
    return oneTapUser;
  } catch (e) {
    if (isErrorWithCode(e) && e.code === statusCodes.SIGN_IN_REQUIRED) {
      // the message is approximation of what Android would return
      const err = new Error('Cannot find a matching credential.');
      Object.assign(err, {
        code: statusCodes.NO_SAVED_CREDENTIAL_FOUND,
      });
      throw err;
    } else {
      throw e;
    }
  }
};

const createAccount: OneTapSignInModule['signIn'] = async (params) => {
  GoogleSignin.configure(params);
  const { user, idToken, serverAuthCode } = await GoogleSignin.signIn({
    // TODO
    // loginHint: params?.loginHint,
  });
  if (!idToken) {
    throwNoIdToken('signIn');
  }
  const oneTapUser: OneTapUser = {
    user,
    idToken,
    serverAuthCode,
    // credentialOrigin is not available on the iOS side and is added for compatibility with Web
    credentialOrigin: 'user',
  };
  return oneTapUser;
};

const requestAuthorization: OneTapSignInModule['requestAuthorization'] = async (
  objectWithScopes,
) => {
  // we return null on iOS because to launch the sign in, we'd need all the params of configure() here as well
  // maybe a separate configure method should exist?

  // on ios, this only serves to add scopes. If you need offline access,
  // you would get serverAuthCode by calling createAccount() with offlineAccess: true
  const serverAuthCode = null;
  try {
    const user = await GoogleSignin.addScopes(objectWithScopes);
    if (!user) {
      return null;
    }
    const { accessToken } = await GoogleSignin.getTokens();
    return { grantedScopes: user.scopes, accessToken, serverAuthCode };
  } catch (err) {
    if (isErrorWithCode(err) && err.code === ios_only_SCOPES_ALREADY_GRANTED) {
      // return the scopes that are already granted
      const user = GoogleSignin.getCurrentUser();
      if (!user) {
        return null;
      }
      const { accessToken } = await GoogleSignin.getTokens();
      return { grantedScopes: user.scopes, accessToken, serverAuthCode };
    }
    throw err;
  }
};

export const GoogleOneTapSignIn: OneTapSignInModule = {
  signIn: signInSilently,
  createAccount,
  presentExplicitSignIn: createAccount,
  signOut: GoogleSignin.signOut,
  requestAuthorization,
};
