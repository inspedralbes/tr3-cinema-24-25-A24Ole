<template>
  <div class="flex gap-2">
      <button 
        v-for="filter in filters" 
        :key="filter"
        @click="emit('update:modelValue', filter)"
        class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
        :class="modelValue === filter ? 'text-white bg-surface-200 hover:bg-surface-300' : 'text-gray-500 hover:text-white'"
      >
        {{ $t(`home.filters.${filter}`) }}
      </button>
  </div>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

const { $t } = useI18n()

defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const filters = ['all', 'adventure', 'crime', 'drama', 'comedy', 'fantasy']
</script>
