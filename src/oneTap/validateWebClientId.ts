import type { ClientId, WebOneTapSignInCallbacks } from './types';
import { warnBadApiUsage } from './warnBadApiUsage';

export const validateWebClientId = (params: {
  webClientId: ClientId;
}): void => {
  if (process.env.NODE_ENV !== 'production') {
    const { webClientId } = params;
    if (
      webClientId !== 'autoDetect' &&
      !webClientId.endsWith('.apps.googleusercontent.com')
    ) {
      console.error(
        `RNGoogleSignIn: You provided an invalid webClientId. It should be either 'autoDetect' or it should end with '.apps.googleusercontent.com'.`,
      );
    }
  }
};

export const validateWebClientIdAndApiUsage = (
  params: {
    webClientId: ClientId;
  },
  callbacks: WebOneTapSignInCallbacks | undefined,
) => {
  validateWebClientId(params);
  warnBadApiUsage(callbacks);
};
