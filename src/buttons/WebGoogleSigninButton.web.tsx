import React from 'react';
import type { WebGoogleSignInButtonProps } from './WebGoogleSigninButton';
import { createGoogleSdkNotFoundError } from '../errors/errorCodes.web';

const containerStyles = {
  small: { height: 20 },
  medium: { height: 32 },
  large: { height: 40 },
};
const noop = () => {
  // without this, the web button will open the One Tap flow
  // but we want the user to be in charge of that explicitly
};
export const WebGoogleSigninButton = React.memo(WebGoogleSigninButtonMemoed);

function WebGoogleSigninButtonMemoed({
  size = 'medium',
  onPress = noop,
  webClientId,
  onError,
  ...rest
}: WebGoogleSignInButtonProps) {
  const renderButton = (ref: HTMLElement | null) => {
    if (!ensurePrerequisites(ref, { webClientId, onError })) {
      return;
    }

    window.google.accounts.id.renderButton(
      ref,
      {
        ...rest,
        logo_alignment: rest.logoAlignment,
        size,
        // @ts-expect-error typings are different from docs
        click_listener: onPress,
      },
      onPress,
    );
  };

  return <span ref={renderButton} style={containerStyles[size]} />;
}

function ensurePrerequisites(
  ref: HTMLElement | null,
  {
    webClientId,
    onError,
  }: Pick<WebGoogleSignInButtonProps, 'webClientId' | 'onError'>,
): ref is HTMLElement {
  if (!ref) {
    return false;
  }
  const { google } = window;
  if (!google) {
    onError && onError(createGoogleSdkNotFoundError());
    console.warn(
      'WebGoogleSigninButton: Google Sign In SDK is not present. Did you forget to load it?',
    );
    return false;
  }

  // @ts-expect-error
  const isInitialized = typeof window.__G_ID_CLIENT__ !== 'undefined';
  if (!isInitialized) {
    // if not initialized, google sdk will complain when rendering the button
    google.accounts.id.initialize({
      client_id: webClientId,
      auto_select: false,
    });
  }
  return true;
}
