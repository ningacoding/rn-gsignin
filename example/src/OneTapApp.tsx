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
  return JSON.stringify(value, null, 2);
};

export const OneTapApp = () => {
  const [userInfoState, setUserInfo] = useState<OneTapUser | null>(null);
  const [errorState, setErrorState] = useState<NativeModuleError | null>(null);

  const presentOneTapSignIn = useCallback(async () => {
    try {
      const userInfo = await GoogleOneTapSignIn.signIn({
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
          // android only
          alert('play services not available or outdated');
          break;
        default:
          alert('Something went wrong' + error.toString() + error.code);
      }
      setErrorState(error);
    } else {
      alert(`an error that's not related to google sign in occurred: ${error}`);
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
    <>
      <WebGoogleSigninButton
        onError={(error) => {
          alert(error.toString());
        }}
      />
      <GoogleSigninButton
        color={GoogleSigninButton.Color.Dark}
        onPress={presentOneTapSignIn}
      />
      {Platform.OS !== 'web' && (
        <Button onPress={_createAccount} title="Sign up with One-tap!" />
      )}
    </>
  );

  return (
    <SafeAreaView style={[styles.pageContainer]}>
      <ScrollView contentContainerStyle={styles.container}>
        {body}

        {Platform.OS !== 'web' && (
          <View
            style={{
              padding: 10,
              borderWidth: 2,
              borderRadius: 10,
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },

  pageContainer: { flex: 1, backgroundColor: '#F5FCFF' },
});
