<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { DocumentoSoportePayload, SupportDocItem, SupportDocTax, SupportDocRetention } from '~/types'
import { exampleSupportDocItems, defaultSupportDocCustomer } from '~/types'

const formStore = useFormStore()
const open = ref(false)
const taxSchema = z.object({
  tax_category: z.string().min(1),
  tax_rate: z.number().min(0).max(100),
  tax_amount: z.number().min(0),
})

const retentionSchema = z.object({
  tax_category: z.string().min(1),
  tax_rate: z.number().min(0).max(100),
})

const itemSchema = z.object({
  sku: z.string().min(1, 'SKU requerido'),
  price: z.number().min(0, 'Precio invalido'),
  quantity: z.number().min(1, 'Cantidad minima 1'),
  description: z.string().min(1, 'Descripcion requerida'),
  discount_rate: z.number().min(0).max(100),
  taxes: z.array(taxSchema).min(1, 'Al menos un impuesto requerido'),
  retentions: z.array(retentionSchema),
})

const customerSchema = z.object({
  department: z.string().min(1, 'Departamento requerido'),
  address_line: z.string().min(1, 'Direccion requerida'),
  party_type: z.string().min(1),
  city: z.string().min(1, 'Ciudad requerida'),
  tax_level_code: z.string().min(1),
  email: z.string().email('Email invalido'),
  country_code: z.string().min(1),
  first_name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().min(1, 'Telefono requerido'),
  party_identification_type: z.string().min(1),
  company_name: z.string().min(1, 'Razon social requerida'),
  family_name: z.string().min(1),
  regimen: z.string().min(1),
  party_identification: z.string().min(1, 'NIT requerido'),
})

const chargeSchema = z.object({
  base_amount: z.number().min(0),
  reason: z.string().min(1, 'Razon requerida'),
  discount: z.boolean(),
})

const schema = z.object({
  support_doc: z.object({
    issue_date: z.string().min(1, 'Fecha requerida'),
    charges: z.array(chargeSchema),
    items: z.array(itemSchema).min(1, 'Al menos un item requerido'),
    payment_means_type: z.string().min(1),
    retentions: z.array(retentionSchema),
    number: z.string().min(1, 'Numero requerido'),
    numbering: z.object({
      resolution_number: z.string().min(1, 'Resolucion requerida'),
      prefix: z.string().min(1, 'Prefijo requerido'),
    }),
    'resident-type': z.string().min(1),
    payment_date: z.string().min(1, 'Fecha de pago requerida'),
    env: z.enum(['PRODUCCION', 'TEST']),
    customer: customerSchema,
    payment_means: z.string().min(1),
  }),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  support_doc: {
    issue_date: '',
    charges: [],
    items: structuredClone(exampleSupportDocItems) as unknown as Schema['support_doc']['items'],
    payment_means_type: 'CREDITO',
    retentions: [{ tax_category: 'RET_IVA', tax_rate: 15 }],
    number: '120',
    numbering: {
      resolution_number: '',
      prefix: 'SD',
    },
    'resident-type': 'RESIDENTE',
    payment_date: '',
    env: 'PRODUCCION',
    customer: structuredClone(defaultSupportDocCustomer) as unknown as Schema['support_doc']['customer'],
    payment_means: 'CREDIT_ACH',
  },
})

const items = computed({
  get: () => formStore.documentoSoporteItems,
  set: (val) => {
    formStore.documentoSoporteItems.splice(0, formStore.documentoSoporteItems.length, ...val)
  },
})

const envOptions = [
  { label: 'Produccion', value: 'PRODUCCION' },
  { label: 'Test', value: 'TEST' },
]

const paymentMeansTypeOptions = [
  { label: 'Credito', value: 'CREDITO' },
  { label: 'Contado', value: 'CONTADO' },
]

const paymentMeansOptions = [
  { label: 'Credito ACH', value: 'CREDIT_ACH' },
  { label: 'Debito ACH', value: 'DEBIT_ACH' },
  { label: 'Efectivo', value: 'CASH' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Transferencia', value: 'TRANSFER' },
]

const partyTypeOptions = [
  { label: 'Persona Juridica', value: 'PERSONA_JURIDICA' },
  { label: 'Persona Natural', value: 'PERSONA_NATURAL' },
]

const taxLevelCodeOptions = [
  { label: 'Simplificado', value: 'SIMPLIFICADO' },
  { label: 'Comun', value: 'COMUN' },
  { label: 'No responsable', value: 'NO_RESPONSABLE' },
]

const regimeOptions = [
  { label: 'Autorretenedor', value: 'AUTORRETENEDOR' },
  { label: 'Responsable IVA', value: 'RESPONSABLE_IVA' },
  { label: 'No responsable', value: 'NO_RESPONSABLE' },
]

const partyIdTypeOptions = [
  { label: 'NIT', value: 'NIT' },
  { label: 'Cedula de Ciudadania', value: 'CC' },
  { label: 'Cedula Extranjeria', value: 'CE' },
  { label: 'Tarjeta Identidad', value: 'TI' },
]

const taxCategoryOptions = [
  { label: 'IVA', value: 'IVA' },
  { label: 'RET_IVA', value: 'RET_IVA' },
  { label: 'RET_FUENTE', value: 'RET_FUENTE' },
]

const residentTypeOptions = [
  { label: 'Residente', value: 'RESIDENTE' },
  { label: 'No Residente', value: 'NO_RESIDENTE' },
]

function addItem() {
  formStore.addDocumentoSoporteItem()
}

function removeItem(index: number) {
  formStore.removeDocumentoSoporteItem(index)
}

function loadExampleData() {
  formStore.documentoSoporteItems.splice(
    0,
    formStore.documentoSoporteItems.length,
    ...structuredClone(exampleSupportDocItems) as unknown as typeof formStore.documentoSoporteItems,
  )
}

function getItemTotal(item: SupportDocItem): number {
  const subtotal = item.quantity * item.price
  const discount = (subtotal * item.discount_rate) / 100
  const afterDiscount = subtotal - discount
  const taxAmount = item.taxes.reduce((sum: number, t: SupportDocTax) => {
    return sum + t.tax_amount
  }, 0)
  return afterDiscount + taxAmount
}

const totalDocumentoSoporte = computed(() => {
  return items.value.reduce((sum: number, item: SupportDocItem) => sum + getItemTotal(item as SupportDocItem), 0)
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const payload: DocumentoSoportePayload = {
    support_doc: {
      ...event.data.support_doc,
      items: items.value as unknown as DocumentoSoportePayload['support_doc']['items'],
    },
  }

  await formStore.submitDocumentoSoporte(payload)
}
</script>

<template>
  <UModal v-model:open="open">
    <slot/>
    <template #header>
      <div class="flex items-center w-full justify-between gap-2">
        <h3 class="text-lg font-semibold">
          Datos del Documento Soporte
        </h3>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="open = false"></UButton>
      </div>
    </template>
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UCard>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UFormField label="Ambiente" name="support_doc.env">
              <USelect v-model="state.support_doc.env" :items="envOptions" placeholder="Seleccione ambiente"
                class="w-full" />
            </UFormField>

            <UFormField label="Numero" name="support_doc.number">
              <UInput v-model="state.support_doc.number" placeholder="Numero de documento" class="w-full" />
            </UFormField>

            <UFormField label="Fecha de emision" name="support_doc.issue_date">
              <UInput v-model="state.support_doc.issue_date" type="date" class="w-full" />
            </UFormField>

            <UFormField label="Fecha de pago" name="support_doc.payment_date">
              <UInput v-model="state.support_doc.payment_date" type="datetime-local" class="w-full" />
            </UFormField>

            <UFormField label="Tipo de residente" name="support_doc.resident-type">
              <USelect v-model="state.support_doc['resident-type']" :items="residentTypeOptions" class="w-full" />
            </UFormField>

            <UFormField label="Medio de pago" name="support_doc.payment_means">
              <USelect v-model="state.support_doc.payment_means" :items="paymentMeansOptions" class="w-full" />
            </UFormField>

            <UFormField label="Tipo de medio de pago" name="support_doc.payment_means_type">
              <USelect v-model="state.support_doc.payment_means_type" :items="paymentMeansTypeOptions" class="w-full" />
            </UFormField>
          </div>

          <div class="mt-4 border-t pt-4">
            <h4 class="text-sm font-semibold mb-3">
              Numeracion
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Numero de resolucion" name="support_doc.numbering.resolution_number">
                <UInput v-model="state.support_doc.numbering.resolution_number" placeholder="18760000001"
                  class="w-full" />
              </UFormField>

              <UFormField label="Prefijo" name="support_doc.numbering.prefix">
                <UInput v-model="state.support_doc.numbering.prefix" placeholder="SD" class="w-full" />
              </UFormField>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-user" class="text-primary" />
              <h3 class="text-lg font-semibold">
                Datos del Cliente
              </h3>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UFormField label="Tipo de persona" name="support_doc.customer.party_type">
              <USelect v-model="state.support_doc.customer.party_type" :items="partyTypeOptions" class="w-full" />
            </UFormField>

            <UFormField label="Tipo de identificacion" name="support_doc.customer.party_identification_type">
              <USelect v-model="state.support_doc.customer.party_identification_type" :items="partyIdTypeOptions"
                class="w-full" />
            </UFormField>

            <UFormField label="Identificacion" name="support_doc.customer.party_identification">
              <UInput v-model="state.support_doc.customer.party_identification" placeholder="NIT o CC" class="w-full" />
            </UFormField>

            <UFormField label="Nombre" name="support_doc.customer.first_name">
              <UInput v-model="state.support_doc.customer.first_name" placeholder="Nombre" class="w-full" />
            </UFormField>

            <UFormField label="Apellido" name="support_doc.customer.family_name">
              <UInput v-model="state.support_doc.customer.family_name" placeholder="Apellido" class="w-full" />
            </UFormField>

            <UFormField label="Razon social" name="support_doc.customer.company_name">
              <UInput v-model="state.support_doc.customer.company_name" placeholder="Razon social" class="w-full" />
            </UFormField>

            <UFormField label="Email" name="support_doc.customer.email">
              <UInput v-model="state.support_doc.customer.email" type="email" placeholder="email@ejemplo.com"
                class="w-full" />
            </UFormField>

            <UFormField label="Telefono" name="support_doc.customer.phone">
              <UInput v-model="state.support_doc.customer.phone" placeholder="Telefono" class="w-full" />
            </UFormField>

            <UFormField label="Direccion" name="support_doc.customer.address_line">
              <UInput v-model="state.support_doc.customer.address_line" placeholder="Direccion" class="w-full" />
            </UFormField>

            <UFormField label="Pais" name="support_doc.customer.country_code">
              <UInput v-model="state.support_doc.customer.country_code" placeholder="CO" class="w-full" />
            </UFormField>

            <UFormField label="Departamento" name="support_doc.customer.department">
              <UInput v-model="state.support_doc.customer.department" placeholder="ANTIOQUIA o 05" class="w-full" />
            </UFormField>

            <UFormField label="Ciudad" name="support_doc.customer.city">
              <UInput v-model="state.support_doc.customer.city" placeholder="MEDELLIN o 001" class="w-full" />
            </UFormField>

            <UFormField label="Regimen tributario" name="support_doc.customer.regimen">
              <USelect v-model="state.support_doc.customer.regimen" :items="regimeOptions" class="w-full" />
            </UFormField>

            <UFormField label="Nivel tributario" name="support_doc.customer.tax_level_code">
              <USelect v-model="state.support_doc.customer.tax_level_code" :items="taxLevelCodeOptions"
                class="w-full" />
            </UFormField>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-package" class="text-primary" />
                <h3 class="text-lg font-semibold">
                  Items
                </h3>
              </div>
              <div class="flex gap-2">
                <UButton variant="outline" size="sm" label="Cargar ejemplo" icon="i-lucide-database"
                  @click="loadExampleData" />
                <UButton size="sm" label="Agregar item" icon="i-lucide-plus" @click="addItem" />
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="(item, index) in items" :key="index" class="border rounded-lg p-4 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-muted">
                  Item #{{ index + 1 }}
                </span>
                <UButton v-if="items.length > 1" variant="ghost" color="error" size="xs" icon="i-lucide-trash-2"
                  @click="removeItem(index)" />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <UFormField label="SKU" :name="`support_doc.items.${index}.sku`">
                  <UInput v-model="item.sku" placeholder="SKU" class="w-full" />
                </UFormField>

                <UFormField label="Descripcion" :name="`support_doc.items.${index}.description`">
                  <UInput v-model="item.description" placeholder="Descripcion del item" class="w-full" />
                </UFormField>

                <UFormField label="Cantidad" :name="`support_doc.items.${index}.quantity`">
                  <UInput v-model.number="item.quantity" type="number" placeholder="Cantidad" class="w-full" />
                </UFormField>

                <UFormField label="Precio" :name="`support_doc.items.${index}.price`">
                  <UInput v-model.number="item.price" type="number" placeholder="Precio" class="w-full" />
                </UFormField>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <UFormField label="Descuento (%)" :name="`support_doc.items.${index}.discount_rate`">
                  <UInput v-model.number="item.discount_rate" type="number" placeholder="0" class="w-full" />
                </UFormField>
              </div>

              <div v-for="(tax, tIndex) in item.taxes" :key="`tax-${tIndex}`"
                class="grid grid-cols-1 md:grid-cols-3 gap-3 pl-4 border-l-2 border-primary/20">
                <UFormField label="Categoria" :name="`support_doc.items.${index}.taxes.${tIndex}.tax_category`">
                  <USelect v-model="tax.tax_category" :items="taxCategoryOptions" class="w-full" />
                </UFormField>

                <UFormField label="Tarifa (%)" :name="`support_doc.items.${index}.taxes.${tIndex}.tax_rate`">
                  <UInput v-model.number="tax.tax_rate" type="number" placeholder="19" class="w-full" />
                </UFormField>

                <UFormField label="Monto impuesto" :name="`support_doc.items.${index}.taxes.${tIndex}.tax_amount`">
                  <UInput v-model.number="tax.tax_amount" type="number" placeholder="0" class="w-full" />
                </UFormField>
              </div>

              <div v-for="(retention, rIndex) in item.retentions" :key="`ret-${rIndex}`"
                class="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-warning/20">
                <UFormField label="Categoria retencion"
                  :name="`support_doc.items.${index}.retentions.${rIndex}.tax_category`">
                  <USelect v-model="retention.tax_category" :items="taxCategoryOptions" class="w-full" />
                </UFormField>

                <UFormField label="Tarifa retencion (%)"
                  :name="`support_doc.items.${index}.retentions.${rIndex}.tax_rate`">
                  <UInput v-model.number="retention.tax_rate" type="number" placeholder="15" class="w-full" />
                </UFormField>
              </div>

              <div class="text-right text-sm font-medium">
                Subtotal item: ${{ getItemTotal(item as SupportDocItem).toLocaleString('es-CO') }}
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end text-lg font-bold">
              Total: ${{ totalDocumentoSoporte.toLocaleString('es-CO') }}
            </div>
          </template>
        </UCard>
        <UAlert v-if="formStore.documentoSoporteState.response"
          :color="formStore.documentoSoporteState.response.success ? 'success' : 'error'"
          :title="formStore.documentoSoporteState.response.success ? 'Exito' : 'Error'"
          :description="formStore.documentoSoporteState.response.message" icon="i-lucide-info" class="flex-1" />

        <div class="sticky -bottom-6 px-6 py-4 bg-default border-t border-default flex justify-end gap-3">
          <UButton variant="outline" label="Limpiar" icon="i-lucide-rotate-ccw"
            @click="formStore.resetDocumentoSoporte()" />
          <UButton type="submit" label="Enviar Documento Soporte" icon="i-lucide-send"
            :loading="formStore.documentoSoporteState.loading" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
