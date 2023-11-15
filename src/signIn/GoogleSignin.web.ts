import type {
  AddScopesParams,
  ConfigureParams,
  GetTokensResponse,
  HasPlayServicesParams,
  SignInParams,
  User,
} from '../types';

const errorMessage = 'RNGoogleSignIn: you are calling a not-implemented method';
const logNotImplementedError = () => {
  console.warn(errorMessage);
};

const throwNotImplementedError = () => {
  throw new Error(errorMessage);
};

async function signIn(_options: SignInParams = {}): Promise<User> {
  return throwNotImplementedError();
}

async function hasPlayServices(
  _options: HasPlayServicesParams = { showPlayServicesUpdateDialog: true },
): Promise<boolean> {
  logNotImplementedError();
  return false;
}

function configure(_options: ConfigureParams = {}): void {
  logNotImplementedError();
}

async function addScopes(_options: AddScopesParams): Promise<User | null> {
  logNotImplementedError();
  return null;
}

async function signInSilently(): Promise<User> {
  return throwNotImplementedError();
}

async function signOut(): Promise<null> {
  logNotImplementedError();
  return null;
}

async function revokeAccess(): Promise<null> {
  logNotImplementedError();
  return null;
}

function hasPreviousSignIn(): boolean {
  logNotImplementedError();
  return false;
}

function getCurrentUser(): User | null {
  logNotImplementedError();
  return null;
}

async function clearCachedAccessToken(_tokenString: string): Promise<null> {
  logNotImplementedError();
  return null;
}

async function getTokens(): Promise<GetTokensResponse> {
  return throwNotImplementedError();
}

export const GoogleSignin = {
  hasPlayServices,
  configure,
  signIn,
  addScopes,
  signInSilently,
  signOut,
  revokeAccess,
  hasPreviousSignIn,
  getCurrentUser,
  clearCachedAccessToken,
  getTokens,
};
