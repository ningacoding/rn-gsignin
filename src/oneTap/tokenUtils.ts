import type { JwtPayload } from 'jwt-decode';

export function getSubject(
  parsed: JwtPayload,
  // userName (not the factual name, but "nickname") may be returned by one tap on android
  emailOrUsername: string,
): string {
  if (parsed.sub) {
    return parsed.sub;
  }
  return emailOrUsername;
}
