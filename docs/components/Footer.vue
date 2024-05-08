<script setup lang="ts">
const { footer } = useAppConfig()
const isOpen = ref(false)
</script>

<template>
  <UFooter>
    <template #left>
      {{ footer.credits }}
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />

      <template v-if="footer?.links">
        <UButton v-for="(link, index) of footer?.links" :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }" />
      </template>
      <UButton color="gray" label="Acknowledgments" variant="ghost" @click="isOpen = true" />

      <UModal v-model="isOpen" fullscreen>
        <UCard :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: {
            base: 'grow'
          }
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Acknowledgments
              </h3>
              <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                @click="isOpen = false" />
            </div>
          </template>

          <iframe class="bg-inherit w-full h-full p-5" src="/api/acknowledgments" target="_self" />
        </UCard>
      </UModal>
    </template>
  </UFooter>
</template>
