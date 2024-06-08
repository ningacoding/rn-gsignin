import { jwtDecode, JwtPayload } from 'jwt-decode';
import type { OneTapUser } from './types';

type JwtContents = {
  name: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
  email: string;
};
export function extractUser(idToken: string): OneTapUser['user'] {
  const parsed = jwtDecode<JwtPayload & JwtContents>(idToken);
  const name = parsed.name;
  const givenName = parsed.given_name;
  const familyName = parsed.family_name;
  const photo = parsed.picture;
  const email = parsed.email;
  const subject = getSubject(parsed, email);
  return {
    id: subject,
    name,
    email,
    givenName,
    familyName,
    photo,
  };
}

function getSubject(
  parsed: JwtPayload,
  // userName (not the factual name, but "nickname") may be returned by one tap on android
  emailOrUsername: string,
): string {
  if (parsed.sub) {
    return parsed.sub;
  }
  return emailOrUsername;
}
