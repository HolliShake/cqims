<script setup>
import HealthService from "@/services/health.service"
import useHealthStore from "@/stores/health.store"
import { requiredValidator } from '@core/utils/validators'
import { inject, nextTick } from "vue"

const healthService = new HealthService()
const healthStore = useHealthStore()
const refVForm = ref()
const modalRef = ref()
const formState = ref()
const formError = ref({
  Label: [],
  Description: [],
})
const toast = inject('toast')

defineExpose({
  open() {
    modalRef.value.open()
    healthStore.resetField()
    formState.value = healthStore.getHealthModel
  },
  openAsUpdateMode(data) {
    healthStore.setField(data)
    formState.value = healthStore.getHealthModel
    modalRef.value.openAsUpdateMode()
  },
  close() {
    modalRef.value.close()
    healthStore.resetField()
  },
})

async function onSubmit() {
  if (await refVForm.value.validate()) (!modalRef.value.isUpdateMode()) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await healthService.createHealth(formState.value)

    if (code == 200)
    {
      healthStore.add(response)
      toast.success("Successfully created health.")
      
      modalRef.value.close()
      reset()
    }
  } catch (err) {
    console.log(err)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function onUpdate() {
  try {
    const { status: code, data: response, message: error } = await healthService.updateHealth(formState.value.id, formState.value)
    
    if (code >= 200 && code <= 299)
    {
      healthStore.update(response)
      toast.success("Successfully updated health.")

      modalRef.value.close()
      reset()
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 Reset
async function reset() {
  formError.value = ({
    Label: [],
    Description: [],
  })
  await nextTick(() => { 
    refVForm.value.resetValidation()
    refVForm.value.reset()
  })
}

// 
</script>


<template>
  <AppModal
    ref="modalRef"
    :max-width="430"
  >
    <template #title>
      Health Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <span class="font-weight-bold text-sm">Label</span>
            <VTextField
              v-model="formState.label"
              :rules="[requiredValidator]"
              :error-messages="formError.Label"
            />
          </VCol>
          <VCol cols="12">
            <span class="font-weight-bold text-sm">Description</span>
            <VTextarea
              v-model="formState.description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.Description"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions="{ isUpdateMode }">
      <VBtn
        class="mt-2"
        variant="elevated"
        :color="(!isUpdateMode) ? 'success' : 'secondary'"
        block
        @click="onSubmit"
      >
        <VIcon
          start
          :icon="(!isUpdateMode)? 'tabler-location' : 'tabler-edit'"
        />
        {{ (!isUpdateMode) ? 'SUBMIT' : 'UPDATE' }}
      </VBtn>
    </template>
  </AppModal>
</template>
