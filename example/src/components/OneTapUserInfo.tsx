import React from 'react';
import { OneTapUser } from '@react-native-google-signin/google-signin';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { prettyJson, PROFILE_IMAGE_SIZE } from './components';

export const OneTapUserInfo = ({
  userInfo,
  signOut,
}: {
  userInfo: OneTapUser;
  signOut: () => any;
}) => {
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
            photo: `${userInfo.user.photo?.slice(0, 25)}...`,
          },
          idToken: `${userInfo.idToken?.slice(0, 5)}...`,
          serverAuthCode: `${userInfo.serverAuthCode?.slice(0, 5)}...`,
        })}
      </Text>
      {userInfo.user.photo && (
        <Image
          style={{ width: PROFILE_IMAGE_SIZE, height: PROFILE_IMAGE_SIZE }}
          source={{ uri: userInfo.user.photo }}
        />
      )}
      <Button onPress={signOut} title="Log out" />
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
});
