import type { WebOneTapSignInCallbacks } from './types';

export const warnBadApiUsage = (
  callbacks: WebOneTapSignInCallbacks | undefined,
) => {
  if (process.env.NODE_ENV !== 'production') {
    if (callbacks) {
      console.error(
        'RNGoogleSignIn: callback-based implementation is not supported on native platforms, only on Web. Use Promise-based one.',
      );
    }
  }
};
