const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

export type FieldError = {
  field: string
  message: string
  rule?: string
}

export class ApiError extends Error {
  status: number
  fieldErrors?: FieldError[]

  constructor(status: number, message: string, fieldErrors?: FieldError[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function extractErrorMessage(body: unknown): {
  message: string
  fieldErrors?: FieldError[]
} {
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>

    if (Array.isArray(record.errors)) {
      const fieldErrors = record.errors.filter(
        (error): error is FieldError =>
          !!error &&
          typeof error === 'object' &&
          typeof (error as FieldError).field === 'string' &&
          typeof (error as FieldError).message === 'string',
      )

      if (fieldErrors.length > 0) {
        return { message: fieldErrors[0].message, fieldErrors }
      }

      const genericMessage = record.errors
        .map((error) =>
          error && typeof error === 'object' && 'message' in error
            ? String((error as { message: unknown }).message)
            : null,
        )
        .filter((value): value is string => !!value)
        .join(', ')

      if (genericMessage) {
        return { message: genericMessage }
      }
    }

    if (typeof record.message === 'string' && record.message.length > 0) {
      return { message: record.message }
    }
  }

  return { message: 'Ocurrió un error inesperado. Intentá nuevamente.' }
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      0,
      'No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo.',
    )
  }

  const json = await parseJsonSafely(response)

  if (!response.ok) {
    const { message, fieldErrors } = extractErrorMessage(json)
    throw new ApiError(response.status, message, fieldErrors)
  }

  if (json && typeof json === 'object' && 'data' in (json as object)) {
    return (json as { data: T }).data
  }

  return json as T
}
