import { OneTapUser, WebOneTapSignInModule } from './types';
import {
  createCancelError,
  createGoogleSdkNotFoundError,
  createNotShownError,
  statusCodes,
} from '../errors/errorCodes.web';
import { extractUser } from './tokenUtils';
import { emitter } from './emitter.web';

export function ensureGoogleSdkPresent() {
  if (typeof window !== 'undefined' && !window.google) {
    throw createGoogleSdkNotFoundError();
  }
}

const signIn: WebOneTapSignInModule['signIn'] = (
  { webClientId, nonce, autoSignIn, ...otherParams },
  { onSuccess, onError, momentListener },
) => {
  ensureGoogleSdkPresent();
  const { google } = window;

  google.accounts.id.initialize({
    client_id: webClientId,
    auto_select: autoSignIn,
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
};

export const WebGoogleOneTapSignIn: WebOneTapSignInModule = {
  signIn,
};
