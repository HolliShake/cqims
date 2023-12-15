<script setup>
import DepartmentService from '@/services/department.service'
import useDepartmentStore from '@/stores/department.store'
import { inject } from 'vue'

const departmentService = new DepartmentService()
const departmentStore = useDepartmentStore()
const modalRef = ref()
const refVForm = ref()
const submitted = ref(false)
const form = ref({})

const formError = ref({
  DepartmentName: [],
})

const toast = inject('toast')

defineExpose({
  open() {
    departmentStore.resetField()
    form.value = departmentStore.getDepartmentModel

    // Open modal
    modalRef.value.open()
  },
  openAsUpdateMode(data) {
    departmentStore.setField(data)
    form.value = departmentStore.getDepartmentModel

    // Open modal
    modalRef.value.openAsUpdateMode()
  },
  close() {
    modalRef.value.close()
    departmentStore.resetField()
  },
})

async function onSubmit() {
  if (await refVForm.value.validate()) (!modalRef.value.isUpdateMode()) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response } = await departmentService.createDepartment(form.value)

    if (code == 200) {
      departmentStore.add(response)
      toast.success("Successfully created department.")

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
    const { status: code, data: response } = await departmentService.updateDepartment(form.value.id, form.value)

    if (code == 200) {
      departmentStore.update(response)
      toast.success("Successfully updated department.")

      modalRef.value.close()
      reset()
    }
  } catch (err) {
    console.log(err)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function reset() {
  refVForm.value.resetValidation()
  refVForm.value.reset()
  submitted.value = false
  formError.value = {
    DepartmentName: [],
  }
}

// 
</script>

<template>
  <AppModal 
    ref="modalRef"
    :max-width="420"
  >
    <template #title>
      Department Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="form.departmentName"
              label="Department Name"
              :error-messages="formError.DepartmentName"
            />  
          </VCol>  
        </VRow>  
      </VForm>
    </template>

    <template #actions="{ isUpdateMode }">
      <VBtn
        block
        :color="(!isUpdateMode) ? 'primary' : 'secondary'"
        @click="onSubmit"
      >
        <VIcon 
          start
          :icon="(!isUpdateMode) ? 'tabler-location' : 'tabler-edit'"
        />
        {{ (!isUpdateMode) ? 'Create' : 'Update' }}  
      </VBtn>
    </template>
  </AppModal>
</template>
