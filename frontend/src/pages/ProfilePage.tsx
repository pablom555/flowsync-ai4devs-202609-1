import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user.initials}
            </div>
            <div>
              <p className="font-medium">{user.fullName ?? 'Sin nombre'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
