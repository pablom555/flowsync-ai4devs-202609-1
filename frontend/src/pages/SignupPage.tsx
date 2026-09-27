import { Link, Navigate } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'
import { SignupForm } from '@/components/auth/SignupForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SignupPage() {
  const { user, isLoading } = useAuth()

  if (!isLoading && user) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Completá tus datos para registrarte en FlowSync.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <SignupForm />
          <p className="text-center text-sm text-muted-foreground">
            ¿Ya tenés una cuenta?{' '}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
