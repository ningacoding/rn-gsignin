import { NativeModule } from '../spec/NativeGoogleSignin';
import { statusCodes as webStatusCodes } from './errorCodes.web';

const {
  SIGN_IN_CANCELLED,
  IN_PROGRESS,
  PLAY_SERVICES_NOT_AVAILABLE,
  SIGN_IN_REQUIRED,
  ONE_TAP_START_FAILED,
  NO_SAVED_CREDENTIAL_FOUND,
  SCOPES_ALREADY_GRANTED,
} = NativeModule.getConstants();

export const ios_only_SCOPES_ALREADY_GRANTED = SCOPES_ALREADY_GRANTED;

/**
 * @group Constants
 * */
export const statusCodes = Object.freeze({
  SIGN_IN_CANCELLED,
  IN_PROGRESS,
  PLAY_SERVICES_NOT_AVAILABLE,
  SIGN_IN_REQUIRED,
  ONE_TAP_START_FAILED,
  NO_SAVED_CREDENTIAL_FOUND,
}) satisfies typeof webStatusCodes;
// if we instead specify the type directly on the const, typedoc will not generate the docs as I want
