import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useAuth } from '@/auth/AuthContext'
import { ApiError } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const signupSchema = z
  .object({
    fullName: z.string().trim().optional(),
    email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener entre 8 y 32 caracteres')
      .max(32, 'La contraseña debe tener entre 8 y 32 caracteres'),
    passwordConfirmation: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

const FIELD_ERROR_KEYS: Record<string, keyof SignupFormValues> = {
  fullName: 'fullName',
  email: 'email',
  password: 'password',
  passwordConfirmation: 'passwordConfirmation',
}

export function SignupForm() {
  const { signup } = useAuth()
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  })

  async function onSubmit(values: SignupFormValues) {
    setFormError(null)
    setIsSubmitting(true)

    try {
      await signup({
        fullName: values.fullName ? values.fullName : null,
        email: values.email,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
      })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fieldErrors && error.fieldErrors.length > 0) {
          let hasFieldError = false
          for (const fieldError of error.fieldErrors) {
            const key = FIELD_ERROR_KEYS[fieldError.field]
            if (key) {
              form.setError(key, { message: fieldError.message })
              hasFieldError = true
            }
          }
          if (!hasFieldError) {
            setFormError(error.message)
          }
        } else {
          setFormError(error.message)
        }
      } else {
        setFormError('Ocurrió un error inesperado. Intentá nuevamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        {formError ? (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        ) : null}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input type="text" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </form>
    </Form>
  )
}
