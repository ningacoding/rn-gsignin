import type { OneTapSignInModule, OneTapUser } from './types';
import {
  createCancelError,
  createFlowRestartedError,
  createGoogleSdkNotFoundError,
  createNotShownError,
  createSignOutFailedError,
  statusCodes,
} from '../errors/errorCodes.web';
import { extractUser } from './tokenUtils';

function ensureGoogleSdkPresent() {
  if (typeof window !== 'undefined' && !window.google) {
    throw createGoogleSdkNotFoundError();
  }
}

const createAccount: OneTapSignInModule['createAccount'] = (
  params,
  momentListener,
) => {
  return signIn({ context: 'signup', ...params }, momentListener);
};

const signIn: OneTapSignInModule['signIn'] = (
  { webClientId, nonce, autoSignIn, ...otherParams },
  momentListener,
) => {
  return new Promise<OneTapUser>((resolve, reject) => {
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
          credentialOrigin: select_by,
        };
        resolve(userInfo);
      },
    });

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const err = createNotShownError(notification.getNotDisplayedReason());
        reject(err);
      }
      if (notification.isSkippedMoment()) {
        const skippedReason = notification.getSkippedReason();
        if (
          ['auto_cancel', 'user_cancel', 'tap_outside'].includes(skippedReason)
        ) {
          reject(createCancelError(skippedReason));
        }
      }
      if (notification.isDismissedMoment()) {
        const dismissedReason = notification.getDismissedReason();
        if (dismissedReason === statusCodes.SIGN_IN_CANCELLED) {
          reject(createCancelError(dismissedReason));
        } else if (dismissedReason === statusCodes.IN_PROGRESS) {
          // TODO not able to reproduce this case
          reject(createFlowRestartedError());
        }
      }
      momentListener && momentListener(notification);
    });
  });
};

const signOut = async (emailOrUniqueId: string): Promise<null> => {
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

export const GoogleOneTapSignIn: OneTapSignInModule = {
  signIn,
  createAccount,
  signOut,
};
