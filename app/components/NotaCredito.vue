<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { NotaCreditoPayload, CreditNoteItem, CreditNoteTax } from '~/types'
import { exampleCreditNoteItems } from '~/types'

const formStore = useFormStore()
const open = ref(false)
const taxSchema = z.object({
  tax_rate: z.number().min(0).max(100),
  tax_category: z.string().min(1),
})

const itemSchema = z.object({
  sku: z.string().min(1, 'SKU requerido'),
  description: z.string().min(1, 'Descripcion requerida'),
  quantity: z.number().min(1, 'Cantidad minima 1'),
  price: z.number().min(0, 'Precio invalido'),
  taxes: z.array(taxSchema).min(1, 'Al menos un impuesto requerido'),
})

const schema = z.object({
  actions: z.object({
    send_dian: z.boolean(),
    send_email: z.boolean(),
  }),
  credit_note: z.object({
    env: z.enum(['PRODUCCION', 'TEST']),
    number: z.number().min(1, 'Numero requerido'),
    invoice_id: z.string().min(1, 'ID de factura requerido'),
    issue_date: z.string().min(1, 'Fecha de emision requerida'),
    sin_factura_referenciada: z.boolean(),
    reason: z.string().min(1, 'Razon requerida'),
    items: z.array(itemSchema).min(1, 'Al menos un item requerido'),
  }),
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  actions: {
    send_dian: true,
    send_email: true,
  },
  credit_note: {
    env: 'PRODUCCION',
    number: 120,
    invoice_id: '',
    issue_date: '',
    sin_factura_referenciada: false,
    reason: 'AJUSTE',
    items: structuredClone(exampleCreditNoteItems) as unknown as Schema['credit_note']['items'],
  },
})

const items = computed({
  get: () => formStore.notaCreditoItems,
  set: (val) => {
    formStore.notaCreditoItems.splice(0, formStore.notaCreditoItems.length, ...val)
  },
})

const envOptions = [
  { label: 'Produccion', value: 'PRODUCCION' },
  { label: 'Test', value: 'TEST' },
]

const reasonOptions = [
  { label: 'Ajuste', value: 'AJUSTE' },
  { label: 'Devolucion', value: 'DEVOLUCION' },
  { label: 'Anulacion', value: 'ANULACION' },
  { label: 'Correccion', value: 'CORRECCION' },
]

const taxCategoryOptions = [
  { label: 'IVA', value: 'IVA' },
]

function addItem() {
  formStore.addNotaCreditoItem()
}

function removeItem(index: number) {
  formStore.removeNotaCreditoItem(index)
}

function loadExampleData() {
  formStore.notaCreditoItems.splice(
    0,
    formStore.notaCreditoItems.length,
    ...structuredClone(exampleCreditNoteItems) as unknown as typeof formStore.notaCreditoItems,
  )
}

function getItemTotal(item: CreditNoteItem): number {
  const subtotal = item.quantity * item.price
  const taxAmount = item.taxes.reduce((sum: number, t: CreditNoteTax) => {
    return sum + (subtotal * t.tax_rate) / 100
  }, 0)
  return subtotal + taxAmount
}

const totalNotaCredito = computed(() => {
  return items.value.reduce((sum: number, item: CreditNoteItem) => sum + getItemTotal(item as CreditNoteItem), 0)
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const dataicoAccountId = formStore.getDataicoAccountId()

  if (!dataicoAccountId) {
    useToast().add({
      title: 'Error',
      description: 'No se encontro dataico_account_id registrado',
      color: 'error',
    })
    return
  }

  const date = new Date(event.data.credit_note.issue_date)

  const issue_date =
    `${String(date.getDate()).padStart(2, '0')}/` +
    `${String(date.getMonth() + 1).padStart(2, '0')}/` +
    `${date.getFullYear()}`

  const payload: NotaCreditoPayload = {
    actions: event.data.actions,
    credit_note: {
      env: event.data.credit_note.env,
      dataico_account_id: dataicoAccountId,
      number: event.data.credit_note.number,
      invoice_id: event.data.credit_note.invoice_id,
      issue_date: issue_date,
      sin_factura_referenciada: event.data.credit_note.sin_factura_referenciada,
      reason: event.data.credit_note.reason,
      items: items.value as unknown as NotaCreditoPayload['credit_note']['items'],
    },
  }

  await formStore.submitNotaCredito(payload)
}
</script>

<template>
  <UModal v-model:open="open">
    <slot />
    <template #header>
      <div class="flex justify-between w-full">
        <h2 class="text-lg font-semibold">Nota Credito</h2>
        <UButton icon="i-lucide-x" variant="ghost" color="neutral" @click="open = false"></UButton>
      </div>
    </template>
    <template #body>
      <UForm :schema="schema" :state="state" class="space-y-6 " @submit="onSubmit">
        <div >
          <UCard>
            <template #header>
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-settings" class="text-primary" />
                  <h3 class="text-base font-semibold">
                    Configuracion
                  </h3>
                </div>
                <div class="flex md:flex-row flex-col gap-6">
                  <UFormField name="actions.send_dian">
                    <USwitch v-model="state.actions.send_dian" label="Enviar a DIAN" />
                  </UFormField>

                  <UFormField name="actions.send_email">
                    <USwitch v-model="state.actions.send_email" label="Enviar por email" />
                  </UFormField>
                </div>
              </div>
            </template>

          </UCard>

          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file-text" class="text-primary" />
                <h3 class="text-lg font-semibold">
                  Datos de la Nota de Credito
                </h3>
              </div>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <UFormField label="Ambiente" name="credit_note.env">
                <USelect v-model="state.credit_note.env" :items="envOptions" placeholder="Seleccione ambiente"
                  class="w-full" />
              </UFormField>

              <UFormField label="Numero" name="credit_note.number">
                <UInput v-model.number="state.credit_note.number" type="number" placeholder="Numero de nota"
                  class="w-full" />
              </UFormField>

              <UFormField label="ID Factura" name="credit_note.invoice_id">
                <UInput v-model="state.credit_note.invoice_id" placeholder="UUID de la factura" class="w-full" />
              </UFormField>

              <UFormField label="Fecha de emision" name="credit_note.issue_date">
                <UInput v-model="state.credit_note.issue_date" type="datetime-local" class="w-full" />
              </UFormField>

              <UFormField label="Razon" name="credit_note.reason">
                <USelect v-model="state.credit_note.reason" :items="reasonOptions" placeholder="Seleccione razon"
                  class="w-full" />
              </UFormField>

              <UFormField label="Sin factura referenciada" name="credit_note.sin_factura_referenciada">
                <USwitch v-model="state.credit_note.sin_factura_referenciada" label="Sin factura referenciada"
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

            <div class="space-y-4 relative mt-10">
              <div v-for="(item, index) in items" :key="index" class="border rounded-lg p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-muted">
                    Item #{{ index + 1 }}
                  </span>
                  <UButton v-if="items.length > 1" variant="ghost" color="error" size="xs" icon="i-lucide-trash-2"
                    @click="removeItem(index)" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <UFormField label="SKU" :name="`credit_note.items.${index}.sku`">
                    <UInput v-model="item.sku" placeholder="SKU" class="w-full" />
                  </UFormField>

                  <UFormField label="Descripcion" :name="`credit_note.items.${index}.description`">
                    <UInput v-model="item.description" placeholder="Descripcion del item" class="w-full" />
                  </UFormField>

                  <UFormField label="Cantidad" :name="`credit_note.items.${index}.quantity`">
                    <UInput v-model.number="item.quantity" type="number" placeholder="Cantidad" class="w-full" />
                  </UFormField>

                  <UFormField label="Precio" :name="`credit_note.items.${index}.price`">
                    <UInput v-model.number="item.price" type="number" placeholder="Precio" class="w-full" />
                  </UFormField>
                </div>

                <div v-for="(tax, tIndex) in item.taxes" :key="tIndex"
                  class="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l-2 border-primary/20">
                  <UFormField label="Categoria de impuesto"
                    :name="`credit_note.items.${index}.taxes.${tIndex}.tax_category`">
                    <USelect v-model="tax.tax_category" :items="taxCategoryOptions" class="w-full" />
                  </UFormField>

                  <UFormField label="Tarifa (%)" :name="`credit_note.items.${index}.taxes.${tIndex}.tax_rate`">
                    <UInput v-model.number="tax.tax_rate" type="number" placeholder="19" class="w-full" />
                  </UFormField>
                </div>

                <div class="text-right text-sm font-medium">
                  Subtotal item: ${{ getItemTotal(item as CreditNoteItem).toLocaleString('es-CO') }}
                </div>
              </div>
            </div>

            <template #footer>
              <div class="flex justify-end text-lg font-bold">
                Total: ${{ totalNotaCredito.toLocaleString('es-CO') }}
              </div>
            </template>
          </UCard>
          <UAlert v-if="formStore.notaCreditoState.response"
            :color="formStore.notaCreditoState.response.success ? 'success' : 'error'"
            :title="formStore.notaCreditoState.response.success ? 'Exito' : 'Error'"
            :description="formStore.notaCreditoState.response.message" icon="i-lucide-info" class="flex-1" />
        </div>
        <div class="sticky -bottom-6 px-6 py-4 border-t border-default bg-default flex justify-end gap-3 overflow-hidden">
          <UButton variant="outline" label="Limpiar" icon="i-lucide-rotate-ccw" @click="formStore.resetNotaCredito()" />
          <UButton type="submit" label="Enviar Nota de Credito" icon="i-lucide-send"
            :loading="formStore.notaCreditoState.loading" />
        </div>
      </UForm>

    </template>
  </UModal>
</template>
