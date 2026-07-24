import { defineStore } from 'pinia'

import type {
  NotaCreditoPayload,
  DocumentoSoportePayload,
  CreditNoteItem,
  SupportDocItem,
} from '~/types'

import {
  defaultCreditNoteItem,
  defaultSupportDocItem,
} from '~/types'

interface ApiResponse {
  success: boolean
  message: string
  data?: unknown
}

interface FormState {
  loading: boolean
  response: ApiResponse | null
}

export const useFormStore = defineStore('forms', {
  state: () => ({
    notaCreditoState: {
      loading: false,
      response: null,
    } as FormState,

    documentoSoporteState: {
      loading: false,
      response: null,
    } as FormState,

    notaCreditoItems: [
      structuredClone(defaultCreditNoteItem),
    ] as CreditNoteItem[],

    documentoSoporteItems: [
      structuredClone(defaultSupportDocItem),
    ] as SupportDocItem[],
  }),

  actions: {
    /**
     * Obtiene el account id almacenado en localStorage.
     */
    getDataicoAccountId(): string {
      if (import.meta.client) {
        return localStorage.getItem('dataico_account_id') || '99192883182381'
      }

      return ''
    },

    /**
     * Agrega un nuevo item vacío al listado de nota crédito.
     */
    addNotaCreditoItem() {
      this.notaCreditoItems.push(
        structuredClone(defaultCreditNoteItem),
      )
    },

    /**
     * Elimina un item de nota crédito.
     * Mantiene al menos un elemento en la lista.
     */
    removeNotaCreditoItem(index: number) {
      if (this.notaCreditoItems.length > 1) {
        this.notaCreditoItems.splice(index, 1)
      }
    },

    /**
     * Agrega un nuevo item vacío al listado de documento soporte.
     */
    addDocumentoSoporteItem() {
      this.documentoSoporteItems.push(
        structuredClone(defaultSupportDocItem),
      )
    },

    /**
     * Elimina un item de documento soporte.
     * Mantiene al menos un elemento en la lista.
     */
    removeDocumentoSoporteItem(index: number) {
      if (this.documentoSoporteItems.length > 1) {
        this.documentoSoporteItems.splice(index, 1)
      }
    },

    /**
     * Envía una nota crédito al backend.
     * Actualiza el estado de carga y la respuesta.
     */
    async submitNotaCredito(payload: NotaCreditoPayload) {
      const toast = useToast()

      this.notaCreditoState.loading = true
      this.notaCreditoState.response = null

      try {
        const { post } = useHttp()

        const data = await post('/nota-credito', payload)

        this.notaCreditoState.response = {
          success: true,
          message: 'Nota de credito enviada correctamente',
          data,
        }

        toast.add({
          title: 'Exito',
          description: 'Nota de credito enviada correctamente',
          color: 'success',
        })

        return data
      }
      catch (error: any) {
        this.notaCreditoState.response = {
          success: false,
          message: error?.message || 'Error al enviar nota de credito',
        }

        toast.add({
          title: 'Error',
          description: error?.message || 'Error al enviar nota de credito',
          color: 'error',
        })

        throw error
      }
      finally {
        this.notaCreditoState.loading = false
      }
    },

    /**
     * Envía un documento soporte al backend.
     * Actualiza el estado de carga y la respuesta.
     */
    async submitDocumentoSoporte(payload: DocumentoSoportePayload) {
      const toast = useToast()

      this.documentoSoporteState.loading = true
      this.documentoSoporteState.response = null

      try {
        const { post } = useHttp()

        const data = await post('/documento-soporte', payload)

        this.documentoSoporteState.response = {
          success: true,
          message: 'Documento soporte enviado correctamente',
          data,
        }

        toast.add({
          title: 'Exito',
          description: 'Documento soporte enviado correctamente',
          color: 'success',
        })

        return data
      }
      catch (error: any) {
        this.documentoSoporteState.response = {
          success: false,
          message: error?.message || 'Error al enviar documento soporte',
        }

        toast.add({
          title: 'Error',
          description: error?.message || 'Error al enviar documento soporte',
          color: 'error',
        })

        throw error
      }
      finally {
        this.documentoSoporteState.loading = false
      }
    },

    /**
     * Restablece el formulario de nota crédito
     * a su estado inicial.
     */
    resetNotaCredito() {
      this.notaCreditoItems = [
        structuredClone(defaultCreditNoteItem),
      ]

      this.notaCreditoState.response = null
    },

    /**
     * Restablece el formulario de documento soporte
     * a su estado inicial.
     */
    resetDocumentoSoporte() {
      this.documentoSoporteItems = [
        structuredClone(defaultSupportDocItem),
      ]

      this.documentoSoporteState.response = null
    },
  },
})