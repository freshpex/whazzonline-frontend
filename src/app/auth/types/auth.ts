export type AuthRole = 'customer' | 'vendor' | 'admin';

export type AuthUser = {
  id: string;
  email: string | null;
  phone: string | null;
  role: AuthRole;
  createdAt?: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type SignupPayload = {
  email?: string;
  phone?: string;
  password: string;
  role?: Exclude<AuthRole, 'admin'>;
};

export type LoginPayload = {
  email?: string;
  phone?: string;
  password: string;
};

export type CreateUserPayload = {
  email?: string;
  phone?: string;
  password: string;
  role: AuthRole;
};
