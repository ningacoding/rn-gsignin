import type { PromptMomentNotification } from 'google-one-tap';
import type { NativeModuleError } from '../types';

const statusCodesRaw = {
  SIGN_IN_CANCELLED: 'cancel_called',
  ONE_TAP_START_FAILED: 'start_failed',
  // NOTE the following codes are arbitrary, but they are used to match the native module
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
  NO_SAVED_CREDENTIAL_FOUND: 'NO_SAVED_CREDENTIAL_FOUND',
};
// keep separate variable statusCodesRaw because if passed directly to Object.freeze,
// the types for web and native would differ
export const statusCodes = Object.freeze(statusCodesRaw);

// TODO vonovak add cause to error

export const createCancelError = (
  reason:
    | ReturnType<PromptMomentNotification['getSkippedReason']>
    | ReturnType<PromptMomentNotification['getDismissedReason']>,
): NativeModuleError => {
  const err = new Error(`User cancelled the sign in flow: ${reason}`);
  Object.assign(err, {
    code: statusCodes.SIGN_IN_CANCELLED,
  });
  return <NativeModuleError>err;
};

export const createNotShownError = (
  reason: ReturnType<PromptMomentNotification['getNotDisplayedReason']>,
): NativeModuleError => {
  // happens with rate limiting
  const err = new Error(`One-tap sign in not displayed: ${reason}`);
  Object.assign(err, {
    code: statusCodes.ONE_TAP_START_FAILED,
  });
  return <NativeModuleError>err;
};

export const createGoogleSdkNotFoundError = (): NativeModuleError => {
  const err = new Error(
    'Google identity SDK script not found. Are you sure it is loaded?',
  );
  Object.assign(err, {
    code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
  });
  return <NativeModuleError>err;
};

export const createSignOutFailedError = (error?: string): NativeModuleError => {
  const err = new Error(`Sign out failed: ${error}`);
  Object.assign(err, {
    code: 'signOut',
  });
  return <NativeModuleError>err;
};
