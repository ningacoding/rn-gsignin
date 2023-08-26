import { OneTapNativeModule } from './spec/NativeOneTapSignIn';

export type OneTapSignInParams = {
  webClientId: string;
  nonce?: string;
  autoSignIn?: boolean;
  filterByAuthorizedAccounts?: boolean;
  passwordRequestSupported?: boolean;
  idTokenRequestSupported?: boolean;
};
export type OneTapUser = {
  user: {
    id: string;
    name: string | null;
    givenName: string | null;
    familyName: string | null;
    photo: string | null;
  };
} & TokenOrPassword;

type TokenOrPassword =
  | {
      idToken: string;
      password: null;
    }
  | {
      idToken: null;
      password: string;
    };

const signIn = (params: OneTapSignInParams): Promise<OneTapUser> => {
  return OneTapNativeModule.signIn({
    autoSignIn: true,
    filterByAuthorizedAccounts: true,
    passwordRequestSupported: true,
    idTokenRequestSupported: true,
    ...params,
  }) as Promise<OneTapUser>;
};
const createAccount = (params: OneTapSignInParams): Promise<OneTapUser> => {
  return OneTapNativeModule.signIn({
    autoSignIn: false,
    filterByAuthorizedAccounts: false,
    passwordRequestSupported: false,
    idTokenRequestSupported: true,
    ...params,
  }) as Promise<OneTapUser>;
};

export const GoogleOneTapSignIn = {
  signIn,
  signOut: OneTapNativeModule.signOut,
  createAccount,
};
