import * as React from 'react'
import {
  getProfile,
  login as loginRequest,
  logout as logoutRequest,
  signup as signupRequest,
  type LoginPayload,
  type SignupPayload,
  type User,
} from '@/api/auth'
import { ApiError } from '@/api/client'

const TOKEN_KEY = 'flowsync.token'
const USER_KEY = 'flowsync.user'

type AuthContextValue = {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  signup: (payload: SignupPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function persistSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  )
  const [user, setUser] = React.useState<User | null>(() => readStoredUser())
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const storedToken = localStorage.getItem(TOKEN_KEY)

      if (!storedToken) {
        setIsLoading(false)
        return
      }

      try {
        const freshUser = await getProfile(storedToken)
        if (!cancelled) {
          setUser(freshUser)
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
        }
      } catch (error) {
        if (!cancelled && error instanceof ApiError && error.status === 401) {
          clearSession()
          setToken(null)
          setUser(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = React.useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload)
    persistSession(response.token, response.user)
    setToken(response.token)
    setUser(response.user)
  }, [])

  const signup = React.useCallback(async (payload: SignupPayload) => {
    const response = await signupRequest(payload)
    persistSession(response.token, response.user)
    setToken(response.token)
    setUser(response.user)
  }, [])

  const logout = React.useCallback(async () => {
    if (token) {
      try {
        await logoutRequest(token)
      } catch {
        // Ignore network/API errors on logout: we clear the local session regardless.
      }
    }
    clearSession()
    setToken(null)
    setUser(null)
  }, [token])

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, login, signup, logout }),
    [user, token, isLoading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }

  return context
}
