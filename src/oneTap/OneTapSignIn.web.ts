import type { OneTapSignInModule } from './types';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { ensureGoogleSdkPresent } from './WebOneTapSignIn.web';
import { createSignOutFailedError } from '../errors/errorCodes.web';

const throwError = async () => {
  const err = new Error(
    'GoogleOneTapSignIn is not available on the Web. Use the WebOneTapSignIn module instead.',
  );
  Object.assign(err, {
    code: statusCodes.SIGN_IN_CANCELLED,
  });
  throw err;
};

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

export const GoogleOneTapSignIn: OneTapSignInModule = {
  signIn: throwError,
  presentExplicitSignIn: throwError,
  createAccount: throwError,
  signOut: signOutWeb,
};
