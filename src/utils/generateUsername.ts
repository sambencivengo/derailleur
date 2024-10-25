import { v4 as uuid } from 'uuid';

export function generateUserNameFromEmail(email: string): string {
  const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');

  const suffix = uuid().slice(0, 4);
  return prefix + suffix;
}