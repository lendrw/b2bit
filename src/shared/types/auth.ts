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
  avatar: {
    id: number;
    high: string;
    medium: string;
    low: string;
  };
  name: string;
  last_name: string;
  email: string;
  role: {
    value: number;
    label: string;
  };
  last_login: string;
  staff_role: {
    value: number;
    label: string;
  };
}

export interface IAuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (authData: IAuth) => void;
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}
