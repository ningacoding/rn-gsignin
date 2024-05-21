import type { accounts, IdConfiguration } from 'google-one-tap';
import type { CredentialResponse } from 'google-one-tap';
import {
  ClientIdOrPlistPath,
  ConfigureParams,
  NativeModuleError,
} from '../types';

type ReducedWebOptions = Omit<
  IdConfiguration,
  'client_id' | 'nonce' | 'auto_select' | 'callback'
>;

type IosConfigurationParams = Pick<
  ConfigureParams,
  'scopes' | 'profileImageSize' | 'openIdRealm' | 'offlineAccess'
> &
  ClientIdOrPlistPath;

/**
 * @group One-tap sign in module
 * */
export type OneTapSignInParams = {
  webClientId: string;
  iosClientId?: string;
  nonce?: string;

  // TODO the below should probably not be in public api, but provided in signIn / createAccount
  autoSignIn?: boolean;
  filterByAuthorizedAccounts?: boolean;
} & IosConfigurationParams &
  ReducedWebOptions;

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
  /**
   *
   * Only present on iOS. Not null only if a valid webClientId and offlineAccess: true was
   * specified in configure().
   *
   * Call requestAuthorization() to obtain it on Android.
   */
  serverAuthCode: string | null;
};

/**
 * @group One-tap sign in module
 * */
export type RequestAuthorizationParams = {
  /**
   * The Google API scopes to request access to. Default is email and profile.
   */
  scopes: string[];
  /**
   * Specifies a hosted domain restriction. By setting this, authorization will be restricted to accounts of the user in the specified domain.
   */
  hostedDomain?: string;
  /**
   * Specifies an account on the device that should be used.
   * */
  accountName?: string;
  /**
   * Add this for offline access. The serverAuthCode will be returned in the response.
   * */
  offlineAccess?: {
    /**
     * Web client ID from Developer Console.
     */
    webClientId: string;
    /**
     * If true, the granted code can be exchanged for an access token and a refresh token. Only use true if your server has suffered some failure and lost the user's refresh token.
     * */
    forceCodeForRefreshToken?: boolean;
  };
};

// TODO - this or callback-based api, or both?
// type SignInResponse =
//   | {
//       result: 'success';
//       credential: OneTapUser;
//     }
//   | {
//       result: 'cancelled';
//       credential: null;
//     }
//   | {
//       result: 'no_saved_credential_found';
//       credential: null;
//     };

/**
 * An object that contains an access token that has access to the `grantedScopes`.
 * On Android, it contains also the `serverAuthCode` if `offlineAccess` was requested.
 *
 * `serverAuthCode` is always `null` on iOS. You would get it by calling `createAccount()` with `offlineAccess: true` on iOS.
 *
 * Is `null` on iOS in case no user is signed in yet.
 *
 * @group One-tap sign in module
 *
 * */
export type AuthorizationResponse = null | {
  grantedScopes: string[];
  accessToken: string;
  serverAuthCode: string | null;
};

// this is the public interface of the module
export type OneTapSignInModule = {
  signIn: (params: OneTapSignInParams) => Promise<OneTapUser>;
  // TODO reduce OneTapSignInParams to only the necessary fields in presentExplicitSignIn
  presentExplicitSignIn: (params: OneTapSignInParams) => Promise<OneTapUser>;
  createAccount: (params: OneTapSignInParams) => Promise<OneTapUser>;
  requestAuthorization: (
    options: RequestAuthorizationParams,
  ) => Promise<AuthorizationResponse>;
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
