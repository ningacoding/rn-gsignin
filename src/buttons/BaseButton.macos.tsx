import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React from 'react';
import { GoogleSigninButtonProps } from './statics';

export const BaseButton = ({
  color,
  style,
  ...rest
}: GoogleSigninButtonProps) => {
  const activeColorScheme = useColorScheme();
  const colorScheme = color ?? activeColorScheme ?? 'light';

  return (
    <TouchableOpacity
      style={[buttonStyles.content, buttonStyles[colorScheme], style]}
      {...rest}
    >
      <Text style={[textStyles[colorScheme], textStyles.content]}>Sign in</Text>
    </TouchableOpacity>
  );
};

const textStyles = StyleSheet.create({
  light: {
    color: 'grey',
  },
  dark: {
    color: 'white',
  },
  content: {
    fontSize: 17,
  },
});
const buttonStyles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    borderRadius: 3,
  },
  light: {
    backgroundColor: 'white',
  },
  dark: {
    backgroundColor: '#4286f5',
  },
});
