import '../../jest/setup';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
  GoogleOneTapSignIn,
  isErrorWithCode,
  WebGoogleOneTapSignIn, // TODO test the web impl of GoogleOneTapSignIn
} from '@react-native-google-signin/google-signin';
import { mockOneTapUserInfo, mockUserInfo } from '../../jest/setup';
import {
  createCancelError,
  createGoogleSdkNotFoundError,
  createSignOutFailedError,
} from '../errors/errorCodes.web';
import { validateWebClientId as validateNative } from '../oneTap/validateWebClientId';
import { validateWebClientId as validateWeb } from '../oneTap/validateWebClientId.web';
import { mockConsole } from './_mockConsole';

describe('Google Sign In', () => {
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
        await GoogleOneTapSignIn.presentExplicitSignIn({
          webClientId: 'mockWebClientId',
        }),
      ).toStrictEqual(mockOneTapUserInfo);
      expect(
        await GoogleOneTapSignIn.signOut(mockOneTapUserInfo.user.id),
      ).toBeNull();
      expect(
        await GoogleOneTapSignIn.requestAuthorization({
          scopes: ['mockScope'],
        }),
      ).toEqual({
        accessToken: 'mockAccessToken',
        grantedScopes: ['mockScope'],
        serverAuthCode: null,
      });

      const onSuccess = jest.fn();
      WebGoogleOneTapSignIn.signIn(
        {
          webClientId: 'mockWebClientId',
        },
        {
          onSuccess,
          onError: jest.fn(),
        },
      );

      expect(onSuccess).toHaveBeenCalledWith(mockOneTapUserInfo);
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

  test.each([
    {
      getError: () => {
        const err = new Error('some error');
        // @ts-expect-error
        err.code = 2;
        return err;
      },
      expected: true,
    },
    { getError: () => new Error('some error'), expected: false },
    { getError: () => null, expected: false },
  ])(
    'isErrorWithCode returns true iff the error has code property',
    ({ getError, expected }) => {
      const err = getError();
      expect(isErrorWithCode(err)).toBe(expected);
    },
  );
  test.each([
    { getError: () => createCancelError() },
    { getError: createGoogleSdkNotFoundError },
    { getError: createSignOutFailedError },
    // errors from native module do have `code` property as well, but they are kinda impossible to test here
  ])('isErrorWithCode returns true for exported web errors', ({ getError }) => {
    const err = getError();
    expect(isErrorWithCode(err)).toBe(true);
  });

  describe('validateWebClientId', () => {
    const methods = [
      { method: validateNative, name: 'validateNative' },
      { method: validateWeb, name: 'validateWeb' },
    ];

    describe.each(methods)('$name', ({ method }) => {
      it.each([
        { webClientId: 'mockWebClientId', shouldError: true },
        { webClientId: '123.apps.googleusercontent.com', shouldError: false },
        { webClientId: 'autoDetect', shouldError: method === validateWeb },
      ])(
        '$name: console.error should be called when webClientId is $webClientId',
        ({ webClientId, shouldError }) => {
          mockConsole((console) => {
            method({ webClientId });
            expect(console.error).toHaveBeenCalledTimes(shouldError ? 1 : 0);
          });
        },
      );
    });
  });
});
