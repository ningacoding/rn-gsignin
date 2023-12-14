// https://github.com/expo/expo/issues/23104#issuecomment-1689566248
import '@expo/metro-runtime';
import React, { useEffect } from 'react';
import { OneTapApp } from '../example/src/OneTapApp';
import { Platform, Text } from 'react-native';

export default function App() {
  const [loaded, setLoaded] = React.useState(Platform.OS !== 'web');
  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onload = () => {
      setLoaded(true);
    };
    scriptTag.onerror = () => {
      console.error('Failed to load Google One Tap script');
      alert('Failed to load Google One Tap script');
    };
    // uncomment to allow sign in when rate limiting kicks in
    // document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;

    document.body.appendChild(scriptTag);
  }, []);

  return loaded ? (
    <>
      <OneTapApp />
    </>
  ) : (
    <Text>Loading...</Text>
  );
}
