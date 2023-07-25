import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  NativeModuleError,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
// @ts-ignore see docs/CONTRIBUTING.md for details
import config from './config';
import { TokenClearingView } from './TokenClearingView';

type ErrorWithCode = Error & { code?: string };

type State = {
  userInfo: User | undefined;
  error: ErrorWithCode | undefined;
};

const prettyJson = (value: any) => {
  return JSON.stringify(value, null, 2);
};
const PROFILE_IMAGE_SIZE = 150;

export default class GoogleSigninSampleApp extends Component<{}, State> {
  state = {
    userInfo: undefined,
    error: undefined,
  };

  async componentDidMount() {
    this._configureGoogleSignIn();
    await this._getCurrentUser();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: config.webClientId,
      offlineAccess: false,
      profileImageSize: PROFILE_IMAGE_SIZE,
    });
  }

  async _getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo, error: undefined });
    } catch (error) {
      const typedError = error as NativeModuleError;
      if (typedError.code === statusCodes.SIGN_IN_REQUIRED) {
        this.setState({
          error: new Error('User not signed it yet, please sign in :)'),
        });
      } else {
        this.setState({ error: typedError });
      }
    }
  }

  render() {
    const { userInfo } = this.state;

    const body = userInfo ? (
      this.renderUserInfo(userInfo)
    ) : (
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Light}
        onPress={this._signIn}
        accessibilityLabel={'sign in'}
      />
    );
    return (
      <SafeAreaView style={[styles.pageContainer]}>
        <ScrollView contentContainerStyle={styles.container}>
          {this.renderHasPreviousSignIn()}
          {this.renderAddScopes()}
          {this.renderGetCurrentUser()}
          {this.renderGetTokens()}
          {body}
          {this.renderError()}
        </ScrollView>
      </SafeAreaView>
    );
  }

  renderHasPreviousSignIn() {
    return (
      <Button
        onPress={async () => {
          const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
          Alert.alert(String(hasPreviousSignIn));
        }}
        title="is there a user signed in?"
      />
    );
  }

  renderGetCurrentUser() {
    return (
      <Button
        onPress={async () => {
          const userInfo = await GoogleSignin.getCurrentUser();
          Alert.alert('current user', userInfo ? prettyJson(userInfo) : 'null');
        }}
        title="get current user"
      />
    );
  }

  renderAddScopes() {
    return (
      <Button
        onPress={async () => {
          const user = await GoogleSignin.addScopes({
            scopes: ['https://www.googleapis.com/auth/user.gender.read'],
          });
          this._getCurrentUser();

          Alert.alert('user', prettyJson(user));
        }}
        title="request more scopes"
      />
    );
  }

  renderGetTokens() {
    return (
      <Button
        onPress={async () => {
          try {
            const tokens = await GoogleSignin.getTokens();
            Alert.alert('tokens', prettyJson(tokens));
          } catch (error) {
            const typedError = error as NativeModuleError;
            this.setState({
              error: typedError,
            });
            Alert.alert('error', String(error));
          }
        }}
        title="get tokens"
      />
    );
  }

  renderUserInfo(userInfo: User) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {userInfo.user.name}</Text>
        <Text selectable style={{ color: 'black' }}>
          Your user info:{' '}
          {prettyJson({
            ...userInfo,
            idToken: `${userInfo.idToken?.slice(0, 5)}...`,
          })}
        </Text>
        {userInfo.user.photo && (
          <Image
            style={{ width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE }}
            source={{ uri: userInfo.user.photo }}
          />
        )}
        <TokenClearingView />

        <Button onPress={this._signOut} title="Log out" />
      </View>
    );
  }

  renderError() {
    const { error } = this.state;
    if (error !== undefined) {
      // @ts-ignore
      const text = `${error.toString()} ${
        // @ts-ignore
        error.code ? `code: ${error.code}` : ''
      }`;
      return (
        <Text selectable style={{ color: 'black' }}>
          {text}
        </Text>
      );
    }
    return null;
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo, error: undefined });
    } catch (error) {
      const typedError = error as NativeModuleError;

      switch (typedError.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          Alert.alert('cancelled');
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          Alert.alert(
            'in progress',
            'operation (eg. sign in) already in progress',
          );
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // android only
          Alert.alert('play services not available or outdated');
          break;
        default:
          Alert.alert('Something went wrong', typedError.toString());
      }
      this.setState({
        error: typedError,
      });
    }
  };

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      this.setState({ userInfo: undefined, error: undefined });
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
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  pageContainer: { flex: 1, backgroundColor: '#F5FCFF' },
});
