import type {
  OneTapSignInModule,
  OneTapSignInParams,
  OneTapUser,
  WebOneTapSignInCallbacks,
} from './types';
import {
  createCancelError,
  createGoogleSdkNotFoundError,
  createNotShownError,
  statusCodes,
  createSignOutFailedError,
} from '../errors/errorCodes.web';
import { extractUser } from './tokenUtils';
import { emitter } from './emitter.web';
import { validateWebClientId } from './validateWebClientId.web';

function ensureGoogleSdkPresent() {
  if (typeof window !== 'undefined' && !window.google) {
    throw createGoogleSdkNotFoundError();
  }
}

export const signInImplWeb = (
  {
    webClientId,
    nonce,
    auto_select,
    skipPrompt = false,
    ...otherParams
  }: OneTapSignInParams & { auto_select: boolean },
  callbacks?: WebOneTapSignInCallbacks,
) => {
  ensureGoogleSdkPresent();
  validateWebClientId({ webClientId });
  if (!callbacks) {
    console.error(
      'RNGoogleSignIn: promise-based implementation is not supported on Web. Pass callbacks instead.',
    );
    return;
  }

  const { onError, onSuccess, momentListener } = callbacks;
  const { google } = window;

  google.accounts.id.initialize({
    client_id: webClientId,
    auto_select,
    nonce,
    context: 'signin',
    ...otherParams,
    callback: ({ credential: idToken, select_by }) => {
      const user = extractUser(idToken);
      const userInfo: OneTapUser = {
        user,
        idToken,
        serverAuthCode: null,
        credentialOrigin: select_by,
      };
      onSuccess(userInfo);
    },
  });
  emitter.emit('init');

  if (!skipPrompt) {
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const err = createNotShownError(notification.getNotDisplayedReason());
        onError(err);
      }
      if (notification.isSkippedMoment()) {
        const skippedReason = notification.getSkippedReason();
        if (
          ['auto_cancel', 'user_cancel', 'tap_outside'].includes(skippedReason)
        ) {
          onError(createCancelError(skippedReason));
        }
      }
      if (notification.isDismissedMoment()) {
        const dismissedReason = notification.getDismissedReason();
        if (dismissedReason === statusCodes.SIGN_IN_CANCELLED) {
          onError(createCancelError(dismissedReason));
        } else if (dismissedReason === 'flow_restarted') {
          // this happens when the one-tap sign in is presented but the user chooses to sign in using the button
          // we cancel the one-tap flow, but the user credential will be returned from the button flow's Promise
          onError(createCancelError(dismissedReason));
        }
        // else: dismissedReason === 'credential_returned' - we don't need to do anything
      }
      momentListener && momentListener(notification);
    });
  }
};

function createAccount(
  params: OneTapSignInParams,
  callbacks: WebOneTapSignInCallbacks,
): void;
function createAccount(params: OneTapSignInParams): Promise<OneTapUser>;
function createAccount(
  params: OneTapSignInParams,
  callbacks?: WebOneTapSignInCallbacks,
): Promise<OneTapUser> | void {
  signInImplWeb(
    { ...params, auto_select: false, context: 'signup' },
    callbacks,
  );
}

function signIn(
  params: OneTapSignInParams,
  callbacks: WebOneTapSignInCallbacks,
): void;
function signIn(params: OneTapSignInParams): Promise<OneTapUser>;
function signIn(
  params: OneTapSignInParams,
  callbacks?: WebOneTapSignInCallbacks,
): Promise<OneTapUser> | void {
  signInImplWeb({ ...params, auto_select: true }, callbacks);
}

const signOutWeb = async (emailOrUniqueId: string): Promise<null> => {
  ensureGoogleSdkPresent();

  const {
    google: { accounts },
  } = window;

  return new Promise((resolve, reject) => {
    accounts.id.revoke(emailOrUniqueId, ({ successful, error }) => {
      if (successful) {
        // https://developers.google.com/identity/gsi/web/reference/js-reference#google.accounts.id.disableAutoSelect
        accounts.id.disableAutoSelect();
        resolve(null);
      } else {
        reject(createSignOutFailedError(error));
      }
    });
  });
};

const throwApiUnavailableError = async () => {
  const err = new Error(
    'The function you called is not implemented on the Web platform.',
  );
  Object.assign(err, {
    code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
  });
  throw err;
};

export const GoogleOneTapSignIn: OneTapSignInModule = {
  signIn,
  createAccount,
  presentExplicitSignIn: createAccount,
  requestAuthorization: throwApiUnavailableError,
  signOut: signOutWeb,
};
