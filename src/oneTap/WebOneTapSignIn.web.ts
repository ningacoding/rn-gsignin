/**
 * @deprecated. Use the GoogleOneTapSignIn module instead.
 * */
import type { WebOneTapSignInModule } from './types';
import { signInImplWeb } from './OneTapSignIn.web';

const logDeprecationWarning = () => {
  console.warn(
    'WebGoogleOneTapSignIn is deprecated. Use the GoogleOneTapSignIn module instead. It works on the web too.',
  );
};

const signIn: WebOneTapSignInModule['signIn'] = (params, callbacks) => {
  logDeprecationWarning();
  signInImplWeb({ ...params, auto_select: true }, callbacks);
};

export const WebGoogleOneTapSignIn: WebOneTapSignInModule = {
  signIn,
};
