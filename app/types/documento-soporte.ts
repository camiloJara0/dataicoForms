export interface SupportDocCharge {
  base_amount: number
  reason: string
  discount: boolean
}

export interface SupportDocTax {
  tax_category: string
  tax_rate: number
  tax_amount: number
}

export interface SupportDocRetention {
  tax_category: string
  tax_rate: number
}

export interface SupportDocItem {
  sku: string
  price: number
  quantity: number
  description: string
  discount_rate: number
  taxes: SupportDocTax[]
  retentions: SupportDocRetention[]
}

export interface SupportDocCustomer {
  department: string
  address_line: string
  party_type: string
  city: string
  tax_level_code: string
  email: string
  country_code: string
  first_name: string
  phone: string
  party_identification_type: string
  company_name: string
  family_name: string
  regimen: string
  party_identification: string
}

export interface SupportDocNumbering {
  resolution_number: string
  prefix: string
}

export interface SupportDoc {
  issue_date: string
  charges: SupportDocCharge[]
  items: SupportDocItem[]
  payment_means_type: string
  retentions: SupportDocRetention[]
  number: string
  numbering: SupportDocNumbering
  'resident-type': string
  payment_date: string
  env: 'PRODUCCION' | 'TEST'
  customer: SupportDocCustomer
  payment_means: string
}

export interface DocumentoSoportePayload {
  support_doc: SupportDoc
}

export const defaultSupportDocItem: SupportDocItem = {
  sku: '',
  price: 0,
  quantity: 1,
  description: '',
  discount_rate: 0,
  taxes: [{ tax_category: 'IVA', tax_rate: 19, tax_amount: 0 }],
  retentions: [],
}

export const defaultSupportDocCustomer: SupportDocCustomer = {
  department: '',
  address_line: '',
  party_type: 'PERSONA_JURIDICA',
  city: '',
  tax_level_code: 'SIMPLIFICADO',
  email: '',
  country_code: 'CO',
  first_name: '',
  phone: '',
  party_identification_type: 'NIT',
  company_name: '',
  family_name: '',
  regimen: 'AUTORRETENEDOR',
  party_identification: '',
}

export const exampleSupportDocItems: SupportDocItem[] = [
  {
    sku: 'REF_PAN_001',
    price: 2300,
    quantity: 10,
    description: 'Pan grand con miel',
    discount_rate: 10.5,
    taxes: [{ tax_category: 'IVA', tax_rate: 19, tax_amount: 190 }],
    retentions: [{ tax_category: 'RET_IVA', tax_rate: 15 }],
  },
  {
    sku: 'REF_PAN_002',
    price: 1500,
    quantity: 5,
    description: 'Pan integral',
    discount_rate: 0,
    taxes: [{ tax_category: 'IVA', tax_rate: 19, tax_amount: 142.5 }],
    retentions: [{ tax_category: 'RET_IVA', tax_rate: 15 }],
  },
]
