import type { accounts, IdConfiguration } from 'google-one-tap';
import { CredentialResponse } from 'google-one-tap';

type ReducedWebOptions = Omit<
  IdConfiguration,
  'client_id' | 'nonce' | 'auto_select' | 'callback'
>;

/**
 * @group One-tap sign in module
 * */
export type OneTapSignInParams = {
  webClientId: string;
  nonce?: string;
  autoSignIn?: boolean;
  filterByAuthorizedAccounts?: boolean;
  passwordRequestSupported?: boolean;
  idTokenRequestSupported?: boolean;
} & ReducedWebOptions;

/**
 * @group One-tap sign in module
 * */
export type OneTapUser = {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    givenName: string | null;
    familyName: string | null;
    photo: string | null;
  };
} & TokenOrPassword & {
    credentialOrigin: CredentialResponse['select_by'];
  };

type TokenOrPassword =
  | {
      idToken: string;
      password: null;
    }
  | {
      idToken: null;
      password: string;
    };

type MomentListener = Parameters<accounts['id']['prompt']>[0];

export type OneTapSignInModule = {
  signIn: (
    params: OneTapSignInParams,
    momentListener?: MomentListener,
  ) => Promise<OneTapUser>;
  createAccount: (
    params: OneTapSignInParams,
    momentListener?: MomentListener,
  ) => Promise<OneTapUser>;
  signOut: (emailOrUniqueId: string) => Promise<null>;
};
