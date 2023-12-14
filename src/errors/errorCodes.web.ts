import type { PromptMomentNotification } from 'google-one-tap';

const statusCodesRaw = {
  SIGN_IN_CANCELLED: 'cancel_called',
  IN_PROGRESS: 'flow_restarted',
  ONE_TAP_START_FAILED: 'start_failed',
  // NOTE the following codes are arbitrary, but they are used to match the native module
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
) => {
  const err = new Error(`User cancelled the sign in flow: ${reason}`);
  Object.assign(err, {
    code: statusCodes.SIGN_IN_CANCELLED,
  });
  return err;
};
export const createNotShownError = (
  reason: ReturnType<PromptMomentNotification['getNotDisplayedReason']>,
) => {
  // happens with rate limiting
  const err = new Error(`One-tap sign in not displayed: ${reason}`);
  Object.assign(err, {
    code: statusCodes.ONE_TAP_START_FAILED,
  });
  return err;
};
export const createFlowRestartedError = () => {
  const err = new Error('User restarted the sign in flow');
  Object.assign(err, {
    code: statusCodes.ONE_TAP_START_FAILED,
  });
  return err;
};

export const createGoogleSdkNotFoundError = () => {
  const err = new Error(
    'Google identity SDK script not found. Are you sure it is loaded?',
  );
  Object.assign(err, {
    code: statusCodes.PLAY_SERVICES_NOT_AVAILABLE,
  });
  return err;
};

export const createSignOutFailedError = (error?: string) => {
  const err = new Error(`Sign out failed: ${error}`);
  Object.assign(err, {
    code: 'signOut',
  });
  return err;
};
