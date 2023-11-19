import React from 'react';
import type { GsiButtonConfiguration } from 'google-one-tap';

/**
 * @group React Components
 * */
export type WebGoogleSignInButtonProps = Omit<
  GsiButtonConfiguration,
  'logo_alignment'
> & {
  logoAlignment?: GsiButtonConfiguration['logo_alignment'];
  onPress?: () => void;
  webClientId: string;
  onError?: (error: Error) => void;
};
/**
 * @group React Components
 * */
export const WebGoogleSigninButton = (_props: WebGoogleSignInButtonProps) => {
  // we return JSX.Element so that the type is the same as for web version
  return <></>;
};
