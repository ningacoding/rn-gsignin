import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { OneTapUser } from '@react-native-google-signin/google-signin';

export interface Spec extends TurboModule {
  signIn(params: {
    webClientId: string;
    nonce?: string;
    autoSignIn: boolean;
    filterByAuthorizedAccounts: boolean;
  }): Promise<OneTapUser>;
  signOut(): Promise<null>;
  explicitSignIn(_params: Object): Promise<OneTapUser>;
  requestAuthorization(params: {
    scopes: string[];
    accountName?: string;
    hostedDomain?: string;
    webClientId?: string;
    forceCodeForRefreshToken: boolean;
  }): Promise<{
    grantedScopes: string[];
    accessToken: string;
    serverAuthCode: string | null;
  }>;
}

export const OneTapNativeModule =
  TurboModuleRegistry.getEnforcing<Spec>('RNOneTapSignIn');
