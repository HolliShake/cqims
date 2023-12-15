<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import ParentService from "@/services/parent.service"
import useParentStore from "@/stores/parent.store"
import { emailValidator, integerValidator, requiredValidator } from '@core/utils/validators'
import { inject, nextTick } from "vue"

// 👉 Services
const parentService = new ParentService()
const parentStore = useParentStore()
const modalRef = ref()
const refVForm = ref()
const formState = ref()
const formError = ref({
  FirstName: [],
  LastName: [],
  Email: [],
  MobileNo: [],
})
const toast = inject('toast')

defineExpose({
  open() {
    modalRef.value.open()
    parentStore.resetField()
    formState.value = parentStore.getParentModel
  },
  openAsUpdateMode(data) {
    parentStore.setField(data)
    formState.value = parentStore.getParentModel
    modalRef.value.openAsUpdateMode()
  },
  close() {
    modalRef.value.close()
    parentStore.resetField()
  },
})

async function onSubmit() {
  if (await refVForm.value.validate()) (!modalRef.value.isUpdateMode()) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await parentService.createParent(formState.value)

    if (code == 200)
    {
      parentStore.add(response)
      toast.success("Successfully created parent.")
      
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
    const { status: code, data: response, message: error } = await parentService.updateParent(formState.value.id, formState.value)
    
    if (code >= 200 && code <= 299)
    {
      parentStore.update(response)
      toast.success("Successfully updated parent.")
      
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
    FirstName: [],
    LastName: [],
    Email: [],
    MobileNo: [],
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
      Parent Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
          >
            <span class="font-weight-bold text-sm">First Name</span>
            <VTextField
              v-model="formState.firstName"
              :rules="[requiredValidator]"
              :error-messages="formError.FirstName"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <span class="font-weight-bold text-sm">Last Name</span>
            <VTextField
              v-model="formState.lastName"
              :rules="[requiredValidator]"
              :error-messages="formError.LastName"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <span class="font-weight-bold text-sm">Email</span>
            <VTextField
              v-model="formState.email"
              :rules="[requiredValidator, emailValidator]"
              :error-messages="formError.Email"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <span class="font-weight-bold text-sm">Mobile No.</span>
            <VTextField
              v-model="formState.mobileNo"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.MobileNo"
            />
          </VCol>
          <VCol cols="12">
            <span class="font-weight-bold text-sm">Relation</span>
            <VTextField
              v-model="formState.relation"
              :rules="[requiredValidator]"
              :error-messages="formError.Relation"
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
