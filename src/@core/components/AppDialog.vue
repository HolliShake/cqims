<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

async function handleClose()
{
  emit('update:modelValue', false)
}

// 
</script>


<template>
  <VDialog
    :model-value="props.modelValue"
    class="v-dialog-sm"
    persistent
  >
    <DialogCloseBtn @click="handleClose" />
  
    <template #activator>
      <slot name="activator" />  
    </template>

    <VCard>
      <VCardTitle class="text-center">
        <slot name="title">
          Dialog Title
        </slot>
      </VCardTitle>
      <VCardText>
        <slot name="content" />
      </VCardText>
      <VCardText class="pa-5 text-center">
        <slot name="actions" />
      </VCardText>
    </VCard>
  </VDialog>
</template>
