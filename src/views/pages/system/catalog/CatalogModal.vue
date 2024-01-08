
<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import CatalogService from '@/services/catalog.service';
import useCatalogStore from '@/stores/catalog.store';



// 👉 Service
const catalogService = new CatalogService()

// 👉 Store
const catalogStore = useCatalogStore()

// 👉 Modal ref
const modalRef = ref()

// 👉 Ref v form
const refVForm = ref()

// 👉 Form state
const formState = ref({})

// 👉 Form Error
const formError = ref({
  catalogName: [],
  catalogDescription: []
})

// 👉 Toast
const toast = inject("toast")

defineExpose({
  open() {
    catalogStore.resetField()
    formState.value = catalogStore.getCatalogModel
    modalRef.value.open()
   
  },
  async openAsUpdateMode(data) {
    await catalogStore.setField(data)
    formState.value =catalogStore.getCatalogModel
    modalRef.value.openAsUpdateMode()
  },
  close() {
    modalRef.value.close()
    catalogStore.resetField()
    formState.value = catalogStore.getCatalogModel
  },
})

async function onSubmit() {
  if (await refVForm.value.validate()) (!modalRef.value.isUpdateMode()) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await catalogService.create(formState.value)

    if (code == 200)
    {
      catalogStore.add(response)
      toast.success("Successfully created catalog.")
      
      modalRef.value.close()
    }
  } catch (err) {
    console.log(err)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function onUpdate() {
  try {
    const { status: code, data: response, message: error } = await catalogService.update(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      catalogStore.update(response)
      toast.success("Successfully updated catalog.")
      
      modalRef.value.close()
    }
  } catch (err) {
    console.log(err)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

</script>


<template>
  <AppModal ref="modalRef">
    <template #title="{ isUpdateMode }">
      Catalog Details
    </template>
    <template #content="{ isUpdateMode }">
      <VForm
        ref="refVForm"
      >
        <VRow>
          <VCol cols="12">
            <VTextField 
              v-model="formState.catalogName"  
              label="Catalog" 
              :rules="[requiredValidator]"
              :error-messages="formError.catalogName"
            />
          </VCol>  
          <VCol cols="12">
            <VTextarea 
              v-model="formState.catalogDescription"
              label="Description"
              auto-grow 
              :rows="3"
              :max-rows="5"
              :error-messages="formError.catalogDescription"
            />
          </VCol>  
          <VCol cols="auto">
            <VCheckbox 
              v-model="formState.isActive"
              label="Active" 
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
