import type { ViewProps } from 'react-native';

export const Color = {
  Dark: 'dark',
  Light: 'light',
} as const;

/**
 * @group React Components
 * */
export type GoogleSigninButtonProps = ViewProps & {
  size?: number;
  color?: 'dark' | 'light';
  disabled?: boolean;
  onPress?: () => void;
};
