export interface CreditNoteTax {
  tax_rate: number
  tax_category: string
}

export interface CreditNoteItem {
  sku: string
  description: string
  quantity: number
  price: number
  taxes: CreditNoteTax[]
}

export interface CreditNote {
  env: 'PRODUCCION' | 'TEST'
  dataico_account_id: string
  number: number
  invoice_id: string
  issue_date: string
  sin_factura_referenciada: boolean
  reason: string
  items: CreditNoteItem[]
}

export interface CreditNoteActions {
  send_dian: boolean
  send_email: boolean
}

export interface NotaCreditoPayload {
  actions: CreditNoteActions
  credit_note: CreditNote
}

export const defaultCreditNoteItem: CreditNoteItem = {
  sku: '',
  description: '',
  quantity: 1,
  price: 0,
  taxes: [{ tax_rate: 19, tax_category: 'IVA' }],
}

export const exampleCreditNoteItems: CreditNoteItem[] = [
  {
    sku: 'SKU_1234',
    description: 'Camisa',
    quantity: 2,
    price: 100,
    taxes: [{ tax_rate: 19, tax_category: 'IVA' }],
  },
  {
    sku: 'SKU_5678',
    description: 'Pantalon',
    quantity: 1,
    price: 250,
    taxes: [{ tax_rate: 19, tax_category: 'IVA' }],
  },
]
