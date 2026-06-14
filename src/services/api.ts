const API_BASE = 'https://api.aftechs.in/api/auth';

export interface RegisterData {
  username: string;
  mobile: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  mobile: string;
  is_paid: boolean;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: ApiUser;
  error?: string;
}

// Register new user
export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || 'Registration failed' };
    }
    return { success: true, message: result.message, user: result.user };
  } catch (error) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

// Login existing user
export async function loginUser(data: LoginData): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error || 'Login failed' };
    }
    return { 
      success: true, 
      token: result.token, 
      user: result.user,
      message: result.message 
    };
  } catch (error) {
    return { success: false, error: 'Network error. Please check your connection.' };
  }
}

// Get profile using token
export async function getProfile(token: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    if (!response.ok) {
      return { success: false, error: result.error };
    }
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: 'Network error.' };
  }
}