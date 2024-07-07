import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { OneTapUser } from '../oneTap/types';

export interface Spec extends TurboModule {
  signIn(params: {
    webClientId: string;
    nonce?: string;
    requestVerifiedPhoneNumber?: boolean;
    autoSignIn: boolean;
    filterByAuthorizedAccounts: boolean;
  }): Promise<OneTapUser>;
  signOut(): Promise<null>;
  explicitSignIn(params: {
    nonce?: string;
    hostedDomain?: string;
    webClientId: string;
  }): Promise<OneTapUser>;
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
