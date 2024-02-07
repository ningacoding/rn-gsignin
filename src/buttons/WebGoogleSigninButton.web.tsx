import React, { useCallback, useEffect } from 'react';
import type { WebGoogleSignInButtonProps } from './WebGoogleSigninButton';
import { createGoogleSdkNotFoundError } from '../errors/errorCodes.web';
import { emitter } from '../oneTap/emitter.web';

export const WebGoogleSigninButton = React.memo(WebGoogleSigninButtonMemoed);

function WebGoogleSigninButtonMemoed({
  size = 'medium',
  onError,
  ...rest
}: WebGoogleSignInButtonProps) {
  const buttonRef = React.useRef<HTMLSpanElement>(null);

  const renderButton = useCallback(
    (ref: HTMLElement) => {
      window.google.accounts.id.renderButton(ref, {
        ...rest,
        logo_alignment: rest.logoAlignment,
        size,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size, JSON.stringify(rest)],
  );

  useEffect(() => {
    checkPrerequisite({ onError });
    const ref = buttonRef.current;
    // @ts-expect-error
    const isInitialized = typeof window.__G_ID_CLIENT__ !== 'undefined';
    if (isInitialized && ref) {
      renderButton(ref);
      return;
    } else {
      return emitter.on('init', () => {
        buttonRef.current && renderButton(buttonRef.current);
      });
    }
  }, [onError, renderButton]);

  return <span ref={buttonRef} style={containerStyles[size]} />;
}

const containerStyles = {
  small: { height: 20 },
  medium: { height: 32 },
  large: { height: 40 },
};

function checkPrerequisite({
  onError,
}: Pick<WebGoogleSignInButtonProps, 'onError'>) {
  const { google } = window;
  if (!google) {
    onError && onError(createGoogleSdkNotFoundError());
    console.warn(
      'WebGoogleSigninButton: Google Sign In SDK is not present. Did you forget to load it?',
    );
  }
}
