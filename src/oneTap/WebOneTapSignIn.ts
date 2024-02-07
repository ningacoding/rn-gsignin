import type { WebOneTapSignInModule } from './types';

import { statusCodes } from '../errors/errorCodes';
import { Platform } from 'react-native';
import type { NativeModuleError } from '../types';

const getError = (): NativeModuleError => {
  const err = new Error(
    `WebGoogleOneTapSignIn is not available on the ${Platform.OS}. Use the GoogleOneTapSignIn module instead.`,
  );
  Object.assign(err, {
    code: statusCodes.SIGN_IN_CANCELLED,
  });
  return <NativeModuleError>err;
};

const reportCancelledResult: WebOneTapSignInModule['signIn'] = (
  _params,
  { onError },
) => {
  onError(getError());
};

/**
 * On the web, call `WebGoogleOneTapSignIn.signIn` on page load or other window events, not as a response to a user interaction.
 *
 * That sets up a listener for authentication events and calls the appropriate callbacks.
 *
 * On other platforms, it calls the `onError` callback with a `SIGN_IN_CANCELLED` error.
 *
 * @group Web One-tap sign in module
 *
 * */
export const WebGoogleOneTapSignIn = {
  signIn: reportCancelledResult,
} satisfies WebOneTapSignInModule;
