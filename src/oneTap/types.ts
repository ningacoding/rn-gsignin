import type { accounts, IdConfiguration } from 'google-one-tap';
import { CredentialResponse } from 'google-one-tap';
import { NativeModuleError } from '../types';

type ReducedWebOptions = Omit<
  IdConfiguration,
  'client_id' | 'nonce' | 'auto_select' | 'callback'
>;

/**
 * @group One-tap sign in module
 * */
export type OneTapSignInParams = {
  webClientId: string;
  iosClientId?: string;
  nonce?: string;
  autoSignIn?: boolean;
  filterByAuthorizedAccounts?: boolean;
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
  idToken: string;
  credentialOrigin: CredentialResponse['select_by'];
};

export type OneTapSignInModule = {
  signIn: (params: OneTapSignInParams) => Promise<OneTapUser>;
  createAccount: (params: OneTapSignInParams) => Promise<OneTapUser>;
  signOut: (emailOrUniqueId: string) => Promise<null>;
};

type MomentListener = Parameters<accounts['id']['prompt']>[0];

/**
 * @group Web One-tap sign in module
 * */
export type WebOneTapSignInCallbacks = {
  /**
   * Called when the user successfully signs in, either using the One-tap flow or the button flow.
   * */
  onSuccess: (userInfo: OneTapUser) => void | Promise<void>;
  /**
   * Called when the user cancels the sign-in flow, or when an error occurs. You can use the `code` property of the error to determine the reason for the error.
   * The reported errors on the web are in the same format as the errors reported on the native platforms, so you can reuse your error handling code.
   * */
  onError: (error: NativeModuleError) => void | Promise<void>;
  /**
   * A callback function that is called when important events take place. See [reference](https://developers.google.com/identity/gsi/web/reference/js-reference#PromptMomentNotification).
   * */
  momentListener?: MomentListener;
};

/**
 * @group Web One-tap sign in module
 * */
export type WebOneTapSignInModule = {
  signIn: (
    params: OneTapSignInParams,
    callbacks: WebOneTapSignInCallbacks,
  ) => void;
};
