import type { DocumentoSoportePayload } from '~/types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<DocumentoSoportePayload>(event)
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Token de autenticacion requerido',
    })
  }

  try {
    const response = await $fetch('/support-docs', {
      baseURL: config.dataicoApiBase,
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body,
    })

    return response
  }
  catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || error?.status || 502,
      message: error?.data?.message || error?.message || 'Error al enviar documento soporte a Dataico',
      data: error?.data,
    })
  }
})
