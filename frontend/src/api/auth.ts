import { apiRequest } from '@/api/client'

export type User = {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
  initials: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type SignupPayload = {
  fullName: string | null
  email: string
  password: string
  passwordConfirmation: string
}

export type LoginPayload = {
  email: string
  password: string
}

export function signup(payload: SignupPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/signup', {
    method: 'POST',
    body: payload,
  })
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function logout(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/api/v1/account/logout', {
    method: 'POST',
    token,
  })
}

export function getProfile(token: string): Promise<User> {
  return apiRequest<User>('/api/v1/account/profile', {
    method: 'GET',
    token,
  })
}
