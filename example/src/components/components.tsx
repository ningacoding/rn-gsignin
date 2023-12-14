import { Alert, Button, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
// @ts-ignore see docs/CONTRIBUTING.md for details
import config from '../config/config';

export const prettyJson = (value: any) => {
  return JSON.stringify(value, null, 2);
};

export const PROFILE_IMAGE_SIZE = 150;
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: config.webClientId,
    iosClientId: config.iosClientId,
    offlineAccess: false,
    profileImageSize: PROFILE_IMAGE_SIZE,
  });
};

export const RenderHasPreviousSignIn = () => {
  return (
    <Button
      onPress={async () => {
        const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
        Alert.alert(String(hasPreviousSignIn));
      }}
      title="is there a user signed in?"
    />
  );
};

export const RenderGetCurrentUser = () => {
  return (
    <Button
      onPress={async () => {
        const userInfo = GoogleSignin.getCurrentUser();
        Alert.alert('current user', userInfo ? prettyJson(userInfo) : 'null');
      }}
      title="get current user"
    />
  );
};

export const RenderError = ({
  error,
}: {
  error: (Error & { code?: string }) | undefined;
}) => {
  if (error !== undefined) {
    // @ts-ignore
    const text = `${error.message} ${
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
};
