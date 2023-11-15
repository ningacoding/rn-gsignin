import type { OneTapSignInModule, OneTapUser } from './types';
import { GoogleSignin } from '../signIn/GoogleSignin';

const signIn: OneTapSignInModule['signIn'] = async (params) => {
  GoogleSignin.configure(params);
  const { user, idToken } = await GoogleSignin.signIn();
  if (!idToken) {
    throw new Error('No idToken present in the signIn response');
  }
  const oneTapUser: OneTapUser = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      givenName: user.givenName,
      familyName: user.familyName,
      photo: user.photo,
    },
    idToken: idToken,
    password: null,
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
