import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'afltech_jwt_token';
const USER_KEY = 'afltech_user_data';

// Save JWT token
export async function saveToken(token: string): Promise<void> {
  await Preferences.set({ key: TOKEN_KEY, value: token });
}

// Get JWT token
export async function getToken(): Promise<string | null> {
  const result = await Preferences.get({ key: TOKEN_KEY });
  return result.value;
}

// Save user data
export async function saveUserData(user: object): Promise<void> {
  await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
}

// Get user data
export async function getUserData(): Promise<any | null> {
  const result = await Preferences.get({ key: USER_KEY });
  return result.value ? JSON.parse(result.value) : null;
}

// Clear all auth data (logout)
export async function clearAuthData(): Promise<void> {
  await Preferences.remove({ key: TOKEN_KEY });
  await Preferences.remove({ key: USER_KEY });
}