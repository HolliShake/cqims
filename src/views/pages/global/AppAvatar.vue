<script setup>
import { avatarText } from '@/@core/utils/formatters'

const props = defineProps({
  src: {
    type: [String, null],
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
})

// 
</script>


<template>
  <VAvatar
    variant="tonal"
    color="success"
    :image="props.src"
    :alt="props.alt"
  >
    <span
      v-if="!props.src"
      class="font-weight-thin text-h6"
    >
      {{ avatarText(props.alt) }}  
    </span>
  </VAvatar>
</template>
