import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Button,
  ScrollView,
  SafeAreaView,
  Platform,
  Text,
  View,
} from 'react-native';
import {
  GoogleOneTapSignIn,
  NativeModuleError,
  statusCodes,
  OneTapUser,
  GoogleSignin,
  WebGoogleSigninButton,
  GoogleSigninButton,
  isErrorWithCode,
  WebGoogleOneTapSignIn,
} from '@react-native-google-signin/google-signin';
// @ts-ignore see docs/CONTRIBUTING.md for details
import config from './config/config';
import { configureGoogleSignIn, RenderError } from './components/components';
import { OneTapUserInfo } from './components/OneTapUserInfo';

const prettyJson = (value: any) => {
  const val = JSON.stringify(value, null, 2);
  console.log(val);
  return val;
};

export const OneTapApp = () => {
  const [userInfoState, setUserInfo] = useState<OneTapUser | null>(null);
  const [errorState, setErrorState] = useState<NativeModuleError | null>(null);

  const presentExplicitSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleOneTapSignIn.presentExplicitSignIn({
        webClientId: config.webClientId,
        iosClientId: config.iosClientId,
      });

      setUserInfo(userInfo);
      setErrorState(null);
    } catch (error) {
      setTimeout(() => {
        handleError(error);
      }, 500);
    }
  }, []);
  const presentOneTapSignIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleOneTapSignIn.signIn({
        webClientId: config.webClientId,
        iosClientId: config.iosClientId,
      });
      console.log({ userInfo });

      setUserInfo(userInfo);
      setErrorState(null);
    } catch (error) {
      setTimeout(() => {
        handleError(error);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      WebGoogleOneTapSignIn.signIn(
        {
          webClientId: config.webClientId,
        },
        {
          onError: (error) => {
            handleError(error);
          },
          onSuccess: (userInfo) => {
            setUserInfo(userInfo);
            setErrorState(null);
          },
          momentListener: (moment) => {
            console.log('moment', moment);
          },
        },
      );
    }
  }, []);

  const _createAccount = async () => {
    try {
      const user = await GoogleOneTapSignIn.createAccount({
        webClientId: config.webClientId,
        iosClientId: config.iosClientId,
      });
      setUserInfo(user);
      setErrorState(null);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.NO_SAVED_CREDENTIAL_FOUND: {
          alert('no saved credential found, try creating an account');
          break;
        }
        case statusCodes.SIGN_IN_CANCELLED:
          console.log('sign in cancelled');
          // sign in was cancelled, don't do anything
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          alert('in progress');
          break;
        case statusCodes.ONE_TAP_START_FAILED:
          // Android and Web only
          alert('failed to present one tap UI:' + error.toString());
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android and Web only
          alert('play services not available or outdated');
          break;
        default:
          alert(
            `Something went wrong: ${error.message.toString()} ${error.code}`,
          );
      }
      setErrorState(error);
    } else {
      alert(`an error that's not related to google sign in occurred: ${error}`);
      setErrorState(null);
    }
  };

  const _signOut = async () => {
    try {
      if (userInfoState) {
        await GoogleOneTapSignIn.signOut(userInfoState.user.id);
        setUserInfo(null);
        setErrorState(null);
      }
    } catch (error) {
      const typedError = error as NativeModuleError;
      setErrorState(typedError);
    }
  };

  const body = userInfoState ? (
    <>
      <OneTapUserInfo userInfo={userInfoState} signOut={_signOut} />
    </>
  ) : (
    <View style={{ gap: 10 }}>
      <WebGoogleSigninButton
        onError={(error) => {
          alert(error.toString());
        }}
      />

      <GoogleSigninButton
        color={GoogleSigninButton.Color.Dark}
        onPress={presentExplicitSignIn}
      />
      {Platform.OS !== 'web' && (
        <>
          <Button onPress={presentOneTapSignIn} title="Sign in with One-tap!" />
          <Button onPress={_createAccount} title="Sign up with One-tap!" />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.pageContainer]}>
      <ScrollView contentContainerStyle={styles.container}>
        {body}

        <View style={{ gap: 10 }}>
          <Button
            onPress={async () => {
              try {
                const authResponse =
                  await GoogleOneTapSignIn.requestAuthorization({
                    scopes: [
                      'https://www.googleapis.com/auth/user.gender.read',
                    ],
                    // scopes: ['profile', 'email'],
                  });
                console.log({ authResponse });

                if (!authResponse) {
                  console.log('no authResponse');
                  return;
                }
                const tokenInfo = await getTokenInfo(authResponse?.accessToken);
                prettyJson({ tokenInfo });
                alert('response: ' + JSON.stringify(authResponse, null, 2));
              } catch (err) {
                handleError(err);
              }
            }}
            title="request access to the gender scope"
          />
          <Button
            onPress={async () => {
              const authResponse =
                await GoogleOneTapSignIn.requestAuthorization({
                  scopes: ['profile', 'email'],
                  offlineAccess: {
                    webClientId: config.webClientId,
                  },
                });
              console.log({ authResponse });

              if (!authResponse) {
                console.log('no authResponse');
                return;
              }
              alert('response: ' + JSON.stringify(authResponse, null, 2));
            }}
            title="request server auth code"
          />
          <Button
            onPress={async () => {
              try {
                const tokenResult =
                  await GoogleOneTapSignIn.requestAuthorization({
                    scopes: [
                      // 'profile' - requesting this always presents the modal
                      'https://www.googleapis.com/auth/userinfo.profile',
                      'https://www.googleapis.com/auth/user.gender.read',
                    ],
                  });
                if (!tokenResult) {
                  throw new Error('called requestAuthorization before sign in');
                }
                const { accessToken } = tokenResult;
                prettyJson({ accessToken });
                const tokenInfo = await getTokenInfo(accessToken);
                prettyJson({ tokenInfo });
                const userInfo = await fetchGender(accessToken);

                prettyJson({ userInfo });
                alert('userInfo ' + JSON.stringify(userInfo, null, 2));
              } catch (err) {
                handleError(err);
              }
            }}
            title="fetch user name and gender"
          />
        </View>

        {Platform.OS !== 'web' && (
          <View
            style={{
              margin: 40,
              padding: 40,
              borderWidth: 2,
              borderRadius: 10,
              gap: 10,
              borderColor: 'black',
            }}
          >
            <Text>Original GoogleSignIn module interop</Text>
            <Button
              onPress={async () => {
                configureGoogleSignIn();
                await GoogleSignin.signInSilently();
                alert('done');
              }}
              title="sign in silently"
            />
            <Button
              onPress={async () => {
                const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
                alert(String(hasPreviousSignIn));
              }}
              title="is there a user signed in?"
            />
            <Button
              onPress={async () => {
                const userInfo = GoogleSignin.getCurrentUser();
                alert(
                  'current user' + userInfo ? prettyJson(userInfo) : 'null',
                );
              }}
              title="get current user"
            />
          </View>
        )}
        <RenderError error={errorState} />
      </ScrollView>
    </SafeAreaView>
  );
};

const fetchGender = (accessToken: string) => {
  const authorization = `Bearer ${accessToken}`;

  const res = fetch(
    `https://content-people.googleapis.com/v1/people/me?personFields=genders%2Cnames`,
    {
      headers: {
        'accept': '*/*',
        'accept-language': 'en;q=0.9,en-US;q=0.8',
        'authorization': authorization,
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
      },
      body: null,
      method: 'GET',
      credentials: 'include',
    },
  );
  return res.then((res) => res.json());
};

const getTokenInfo = (accessToken: string) => {
  return fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`,
  ).then((res) => res.json());
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    gap: 10,
  },

  pageContainer: { flex: 1, backgroundColor: '#F5FCFF' },
});
