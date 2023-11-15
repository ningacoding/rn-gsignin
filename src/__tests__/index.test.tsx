import '../../jest/setup';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
  GoogleOneTapSignIn,
} from '@react-native-google-signin/google-signin';
import { mockOneTapUserInfo, mockUserInfo } from '../../jest/setup';

describe('sanity checks for exported mocks', () => {
  it('oneTapSignIn', async () => {
    expect(
      await GoogleOneTapSignIn.signIn({
        webClientId: 'mockWebClientId',
      }),
    ).toStrictEqual(mockOneTapUserInfo);
    expect(
      await GoogleOneTapSignIn.createAccount({
        webClientId: 'mockWebClientId',
      }),
    ).toStrictEqual(mockOneTapUserInfo);
    expect(
      await GoogleOneTapSignIn.signOut(mockOneTapUserInfo.user.id),
    ).toBeNull();
  });

  it('status codes', () => {
    expect(statusCodes).toStrictEqual({
      IN_PROGRESS: 'mock_IN_PROGRESS',
      PLAY_SERVICES_NOT_AVAILABLE: 'mock_PLAY_SERVICES_NOT_AVAILABLE',
      SIGN_IN_CANCELLED: 'mock_SIGN_IN_CANCELLED',
      SIGN_IN_REQUIRED: 'mock_SIGN_IN_REQUIRED',
      NO_SAVED_CREDENTIAL_FOUND: 'mock_NO_SAVED_CREDENTIAL_FOUND',
      ONE_TAP_START_FAILED: 'mock_ONE_TAP_START_FAILED',
    });
  });

  it('original sign in', async () => {
    expect(GoogleSignin.hasPreviousSignIn()).toBe(true);
    expect(await GoogleSignin.signIn()).toStrictEqual(mockUserInfo);
    expect(GoogleSignin.getCurrentUser()).toStrictEqual(mockUserInfo);
    expect(await GoogleSignin.signOut()).toBeNull();
    expect(GoogleSigninButton).toBeInstanceOf(Function);
  });
});
