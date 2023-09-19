<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import ProgramCategoryService from "@/services/program-category.service"
import useProgramCategoryStore from "@/stores/program-category.store"
import { alphaDashValidator, integerValidator, requiredValidator } from '@core/utils/validators'
import { inject, nextTick, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isUpdateMode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

// 👉 Services
const programCategoryService = new ProgramCategoryService()

// 👉 Store
const programCategoryStore = useProgramCategoryStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  ProgramCategoryName: [],
  ProgramCategoryDescription: [],
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return props.isUpdateMode
})

// 👉 Loaded flag
const loaded = ref(!isUpdateMode.value)

// 👉 Toast
const toast = inject('toast')

// 👉 Watch props
watch(props, props => {
  visible.value = props.modelValue
}, { deep: true })

// 👉 Watch visible
watch(visible, visible => {
  emit('update:modelValue', visible)
})

// 👉 Watch campus model
watch(visible, async visible => {
  if (!visible) return programCategoryStore.resetField()

  // Set
  formState.value = programCategoryStore.getProgramCategoryModel
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await programCategoryService.createProgramCategory(formState.value)

    if (code >= 200 && code <= 299)
    {
      programCategoryStore.add(response)
      toast.success("Examination successfully created.")

      visible.value = false
      reset()
    }
    else
    {
      toast.error(error)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 On update campus
async function onUpdate() {
  try {
    const { status: code, data: response, message: error } = await programCategoryService.updateProgramCategory(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      programCategoryStore.update(response)
      toast.success("Examination successfully updated.")

      visible.value = false
      reset()
    }
    else
    {
      toast.error(error)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function reset() {
  formError.value = ({
    ProgramCategoryName: [],
    ProgramCategoryDescription: [],
  })
  await nextTick(() => {
    refVForm.value.reset()
    refVForm.value.resetValidation()
  })
}

// 
</script>


<template>
  <AppDialog v-model="visible">
    <template #title>
      Program Category Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.programCategoryName"
              label="Program Category Name"
              :rules="[requiredValidator]"
              :error-messages="formError.ProgramCategoryName"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.programCategoryDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.ProgramCategoryDescription"
              :loading="!loaded"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions>
      <VBtn
        variant="elevated"
        :color="(!isUpdateMode) ? 'primary' : 'secondary'"
        @click="onSubmit"
      >
        <VIcon
          start
          :icon="(!isUpdateMode)? 'tabler-location' : 'tabler-edit'"
        />
        {{ (!isUpdateMode) ? 'SUBMIT' : 'UPDATE' }}
      </VBtn>
    </template>
  </AppDialog>
</template>
