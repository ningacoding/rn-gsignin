import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // using Object to be compatible with old arch
  signIn(params: Object): Promise<Object>;
  signOut(): Promise<null>;
  explicitSignIn(_params: Object): Promise<Object>;
}

export const OneTapNativeModule =
  TurboModuleRegistry.getEnforcing<Spec>('RNOneTapSignIn');
