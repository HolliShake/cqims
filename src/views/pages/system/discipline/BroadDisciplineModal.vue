<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import BroadDisciplineService from "@/services/broad-discipline.service"
import useBroadDisciplineStore from "@/stores/broad-discipline.store"
import { requiredValidator } from '@core/utils/validators'
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
const broadDisciplineService = new BroadDisciplineService()

// 👉 Store
const broadDisciplineStore = useBroadDisciplineStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  BroadDisciplineCode: [],
  BroadDisciplineDescription: [],
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
  if (!visible) return broadDisciplineStore.resetField()

  // Set
  formState.value = broadDisciplineStore.getBroadDisciplineModel
}, { deep: true })

// 👉 On submit
async function onSubmit() 
{
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() 
{
  try {
    const { status: code, data: response, message: error } = await broadDisciplineService.createBroadDiscipline(formState.value)

    if (code >= 200 && code <= 299)
    {
      broadDisciplineStore.add(response)
      toast.success("Broad discipline successfully created.")

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
async function onUpdate() 
{
  try {
    const { status: code, data: response, message: error } = await broadDisciplineService.updateBroadDiscipline(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      broadDisciplineStore.update(response)
      toast.success("Broad discipline successfully updated.")

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
    BroadDisciplineCode: [],
    BroadDisciplineDescription: [],
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
      Broad Discipline Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.broadDisciplineCode"
              label="Broad discipline code"
              :rules="[requiredValidator]"
              :error-messages="formError.BroadDisciplineCode"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.broadDisciplineDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.broadDisciplineDescription"
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
