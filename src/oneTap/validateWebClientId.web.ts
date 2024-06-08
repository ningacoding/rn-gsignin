import type { ClientId } from './types';

export const validateWebClientId = ({
  webClientId,
}: {
  webClientId: ClientId;
}): void => {
  if (process.env.NODE_ENV !== 'production') {
    if (!webClientId.endsWith('.apps.googleusercontent.com')) {
      console.error(
        `RNGoogleSignIn: You provided an invalid webClientId. It should end with '.apps.googleusercontent.com'. 'autoDetect' is not supported on Web.`,
      );
    }
  }
};
