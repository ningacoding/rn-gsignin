import type { OneTapSignInModule, OneTapUser } from './types';
import { GoogleSignin } from '../signIn/GoogleSignin';

const signIn: OneTapSignInModule['signIn'] = async (params) => {
  GoogleSignin.configure(params);
  const { user, idToken } = await GoogleSignin.signIn();
  if (!idToken) {
    throw new Error('No idToken present in the signIn response');
  }
  const oneTapUser: OneTapUser = {
    user,
    idToken,
    // credentialOrigin is not available on the iOS side and is added for compatibility with web
    credentialOrigin: 'user',
  };
  return oneTapUser;
};

export const GoogleOneTapSignIn: OneTapSignInModule = {
  signIn,
  createAccount: signIn,
  signOut: GoogleSignin.signOut,
};
