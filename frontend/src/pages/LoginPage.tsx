import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function LoginPage() {
  const { user, isLoading } = useAuth()

  if (!isLoading && user) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresá tu email y contraseña para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            ¿No tenés una cuenta?{' '}
            <Link
              to="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
