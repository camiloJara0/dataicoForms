<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'es',
  },
})
const mobil = ref(false)
const title = 'Dataico Forms'
const description = 'Formulario para envio de Notas de Credito y Documentos Soporte a Dataico'

const itemsToggle = [
  {label: 'token'},
]

useSeoMeta({
  title,
  description,
})

const { token, dataicoAccountId, loadFromStorage, saveToStorage } = useDataicoConfig()

onMounted(() => {
  loadFromStorage()
})
</script>

<template>
  <UDashboardNavbar title="Configuracion">
    <template #right>
      <div class="md:flex hidden items-center gap-3">
        <UInput
          v-model="token"
          placeholder="Token"
          icon="i-lucide-key"
          class="w-56"
        />
        <UInput
          v-model="dataicoAccountId"
          placeholder="Account ID Dataico"
          icon="i-lucide-hash"
          class="w-56"
        />
        <UButton
          color="primary"
          variant="solid"
          icon="i-lucide-save"
          label="Guardar"
          @click="saveToStorage"
        />
      </div>
    </template>
    <template #toggle>
      <UButton v-if="!mobil" icon="i-lucide-menu" color="primary" variant="ghost" class="md:hidden"
        @click="mobil = !mobil" />
    </template>
  </UDashboardNavbar>
  <teleport v-if="mobil" to="body">

    <div class="md:hidden fixed left-0 top-0 bottom-0 bg-gray-900 p-6">
      <UButton icon="i-lucide-x" color="primary" variant="ghost" class="mb-4" @click="mobil = !mobil" />
      <UNavigationMenu :items="itemsToggle" orientation="vertical">
        <template #item>
          <div class="flex flex-col gap-2">
            <UInput
              v-model="token"
              placeholder="Token"
              icon="i-lucide-key"
              class="w-56"
            />
            <UInput
              v-model="dataicoAccountId"
              placeholder="Account ID Dataico"
              icon="i-lucide-hash"
              class="w-56"
            />
            <UButton
              color="primary"
              variant="solid"
              icon="i-lucide-save"
              label="Guardar"
              @click="saveToStorage"
            />
          </div>
        </template>
      </UNavigationMenu>
    </div>
  </teleport>

  <UContainer class="py-10 bg-gray-50">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-gray-900">
        Documentos Electrónicos
      </h1>
      <p class="text-gray-500 mt-2">
        Selecciona el proceso que deseas realizar
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <!-- NOTA CRÉDITO -->
      <NotaCredito class="w-full">
        <UCard
          class="group h-[500px] w-full cursor-pointer overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div class="flex flex-col h-full justify-around items-center">

            <div class="flex items-center gap-4 mb-6">
              <div
                class="size-14 rounded-xl my-10 bg-blue-500 text-white flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-file-minus"
                  class="size-8"
                />
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  Nota Crédito
                </h2>
                <p class="text-gray-600 text-sm">
                  Corrección o anulación de facturas emitidas
                </p>
              </div>
            </div>

            <!-- Ilustración -->
            <div class="flex-1 flex items-center justify-center">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-red-300 blur-3xl opacity-20 rounded-full"
                />

                <UIcon
                  name="i-lucide-receipt-text"
                  class="text-blue-500 size-44 relative z-10"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center gap-2 text-primary font-semibold">
              Crear Nota Crédito
              <UIcon name="i-lucide-arrow-right" class="size-5" />
            </div>
          </div>
        </UCard>
      </NotaCredito>

      <!-- DOCUMENTO SOPORTE -->
      <DocumentoSoporte class="w-full">
        <UCard
          class="group h-[500px] w-full cursor-pointer overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
        >
          <div class="flex flex-col h-full justify-between items-center">

            <div class="flex items-center gap-4 mb-6">
              <div
                class="size-14 rounded-xl my-10 bg-emerald-500 text-white flex items-center justify-center"
              >
                <UIcon
                  name="i-lucide-file-plus"
                  class="size-8"
                />
              </div>

              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  Documento Soporte
                </h2>
                <p class="text-gray-600 text-sm">
                  Registro de compras a proveedores no obligados a facturar
                </p>
              </div>
            </div>

            <!-- Ilustración -->
            <div class="flex-1 flex items-center justify-center">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-emerald-300 blur-3xl opacity-20 rounded-full"
                />

                <UIcon
                  name="i-lucide-files"
                  class="text-emerald-500 size-44 relative z-10"
                />
              </div>
            </div>

            <div class="mt-5 flex items-center gap-2 text-success font-semibold">
              Crear Documento Soporte
              <UIcon name="i-lucide-arrow-right" class="size-5" />
            </div>
          </div>
        </UCard>
      </DocumentoSoporte>

    </div>
  </UContainer>
</template>
