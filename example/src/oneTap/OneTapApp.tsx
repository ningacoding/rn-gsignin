import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  GoogleOneTapSignIn,
  NativeModuleError,
  statusCodes,
  OneTapUser,
  GoogleSignin,
  WebGoogleSigninButton,
  OneTapSignInParams,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
// @ts-ignore see docs/CONTRIBUTING.md for details
import config from '../config/config';
import {
  configureGoogleSignIn,
  PROFILE_IMAGE_SIZE,
  RenderError,
} from '../components';

type ErrorWithCode = Error & { code?: string };

type State = {
  userInfo: OneTapUser | undefined;
  error: ErrorWithCode | undefined;
};

const prettyJson = (value: any) => {
  return JSON.stringify(value, null, 2);
};

export class OneTapApp extends Component<{}, State> {
  state: State = {
    userInfo: undefined,
    error: undefined,
  };

  render() {
    const { userInfo } = this.state;

    const body = userInfo ? (
      this.renderUserInfo(userInfo)
    ) : (
      <>
        <WebGoogleSigninButton
          webClientId={config.webClientId}
          onPress={() => {
            this._signIn();
          }}
        />
        <GoogleSigninButton
          color={GoogleSigninButton.Color.Dark}
          onPress={() => {
            this._signIn();
          }}
        />
        <Button onPress={this._createAccount} title="Sign up with One-tap!" />
      </>
    );
    return (
      <SafeAreaView style={[styles.pageContainer]}>
        <ScrollView contentContainerStyle={styles.container}>
          {Platform.OS !== 'web' && (
            <>
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
            </>
          )}
          {body}
          <RenderError error={this.state.error} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  renderUserInfo(userInfo: OneTapUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {userInfo.user.name}</Text>
        <Text selectable style={{ color: 'black' }}>
          Your user info:{' '}
          {prettyJson({
            ...userInfo,
            user: {
              ...userInfo.user,
              id: userInfo.user.id.slice(0, 5) + '...',
              photo: `${userInfo.user.photo?.slice(0, 5)}...`,
            },
            idToken: `${userInfo.idToken?.slice(0, 5)}...`,
          })}
        </Text>
        {userInfo.user.photo && (
          <Image
            style={{ width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE }}
            source={{ uri: userInfo.user.photo }}
          />
        )}

        <Button onPress={this._signOut} title="Log out" />
      </View>
    );
  }

  _createAccount = async () => {
    try {
      const userInfo = await GoogleOneTapSignIn.createAccount({
        webClientId: config.webClientId,
      });
      this.setState({ userInfo, error: undefined });
    } catch (error) {
      const typedError = error as NativeModuleError;
      alert('Something went wrong' + typedError.toString());
      this.setState({ error: typedError });
    }
  };

  _signIn = async (extraParams?: Omit<OneTapSignInParams, 'webClientId'>) => {
    try {
      const userInfo = await GoogleOneTapSignIn.signIn({
        webClientId: config.webClientId,
        ...extraParams,
      });

      this.setState({ userInfo, error: undefined });
    } catch (error) {
      const typedError = error as NativeModuleError;

      switch (typedError.code) {
        case statusCodes.NO_SAVED_CREDENTIAL_FOUND: {
          alert('no saved credential found, try creating an account');
          break;
        }
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          alert('in progress');
          break;
        case statusCodes.ONE_TAP_START_FAILED:
          // Android and Web only
          alert(
            'failed to present one tap UI, maybe because user closed the popup previously?',
          );
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          alert('play services not available or outdated');
          break;
        default:
          alert('Something went wrong' + typedError.toString());
      }
      this.setState({
        error: typedError,
      });
    }
  };

  _signOut = async () => {
    try {
      const { userInfo } = this.state;

      if (userInfo) {
        await GoogleOneTapSignIn.signOut(userInfo.user.id);

        this.setState({ userInfo: undefined, error: undefined });
      }
    } catch (error) {
      const typedError = error as NativeModuleError;

      this.setState({
        error: typedError,
      });
    }
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  pageContainer: { flex: 1, backgroundColor: '#F5FCFF' },
});
