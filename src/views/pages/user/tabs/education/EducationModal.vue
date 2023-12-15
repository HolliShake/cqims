<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue"
import EducationService from "@/services/education.service"
import useEducationStore from "@/stores/education.store"
import { requiredValidator } from '@core/utils/validators'
import { inject, nextTick } from "vue"
import { StatusMap } from "./status.map"

const educationService = new EducationService()
const educationStore = useEducationStore()
const refVForm = ref()
const modalRef = ref()
const formState = ref()

// 👉 Form error
const formError = ref({
  SchoolName: [],
  From: [],
  To: [],
  Description: [],
  Status: [],
})

const toast = inject('toast')

defineExpose({
  open() {
    modalRef.value.open()
    educationStore.resetField()
    formState.value = educationStore.getEducationModel
  },
  openAsUpdateMode(data) {
    educationStore.setField(data)
    formState.value = educationStore.getEducationModel
    modalRef.value.openAsUpdateMode()
  },
  close() {
    modalRef.value.close()
    educationStore.resetField()
  },
})

async function onSubmit() {
  if (await refVForm.value.validate()) (!modalRef.value.isUpdateMode()) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await educationService.createUserEducation(formState.value)

    if (code == 200)
    {
      educationStore.add(response)
      toast.success("Successfully created user education.")
      
      modalRef.value.close()
      reset()
    }
  } catch (err) {
    console.log(err)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function onUpdate() {
  try 
  {
    const { status: code, data: response, message: error } = await educationService.updateUserEducation(formState.value.id, formState.value)
    
    if (code >= 200 && code <= 299)
    {
      educationStore.update(response)
      toast.success("Successfully updated user education.")

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
    SchoolName: [],
    From: [],
    To: [],
    Description: [],
    Status: [],
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
      Education Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <span class="font-weight-bold text-sm">School</span>
            <VTextField
              v-model="formState.schoolName"
              :rules="[requiredValidator]"
              :error-messages="formError.SchoolName"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Date & Other Information" />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <span class="font-weight-bold text-sm">From</span>
            <AppDateTimePicker
              v-model="formState.from"
              :rules="[requiredValidator]"
              :error-messages="formError.From"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <span class="font-weight-bold text-sm">To</span>
            <AppDateTimePicker
              v-model="formState.to"
              :error-messages="formError.To"
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
          <VCol cols="12">
            <VRadioGroup
              v-model="formState.status"
              inline
            >
              <VRadio
                v-for="(status, index) in StatusMap"
                :key="`status-${index}`"
                :label="status.title"
                :value="status.value"
              />
            </VRadioGroup>
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
