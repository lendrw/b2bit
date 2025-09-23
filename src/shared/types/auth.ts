export interface IAuth {
  accessToken: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface IAuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: IAuth) => void;
  logout: () => void;
}
