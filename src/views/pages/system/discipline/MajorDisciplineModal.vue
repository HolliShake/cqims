<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import MajorDisciplineService from "@/services/major-discipline.service"
import BroadDisciplineService from "@/services/broad-discipline.service"
import useMajorDisciplineStore from "@/stores/major-discipline.store"
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
const majorDisciplineService = new MajorDisciplineService()

// 👉 Store
const majorDisciplineStore = useMajorDisciplineStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  MajorDisciplineCode: [],
  MajorDisciplineDescription: [],
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return props.isUpdateMode
})

// 👉 Loaded flag
const loaded = ref(!isUpdateMode.value)

// 👉 Toast
const toast = inject('toast')

// 👉 Broad discipline items
const broadDisciplineItems = computedAsync(async () => {
  return await (new BroadDisciplineService()).getAllBroadDiscipline()
    .then(res => {
      if (res.data.constructor.name != "Array") return []

      return res.data.map(bd => ({
        title: bd.broadDisciplineCode,
        value: bd.id,
      }))
    })
    .catch(() => [])
})

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
  if (!visible) return majorDisciplineStore.resetField()

  // Set
  formState.value = majorDisciplineStore.getMajorDisciplineModel
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
    const { status: code, data: response, message: error } = await majorDisciplineService.createMajorDiscipline(formState.value)

    if (code >= 200 && code <= 299)
    {
      majorDisciplineStore.add(response)
      toast.success("Major discipline successfully created.")

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
    const { status: code, data: response, message: error } = await majorDisciplineService.updateMajorDiscipline(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      majorDisciplineStore.update(response)
      toast.success("Major discipline successfully updated.")

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
    MajorDisciplineCode: [],
    MajorDisciplineDescription: [],
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
      Major Discipline Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.majorDisciplineCode"
              label="Major discipline code"
              :rules="[requiredValidator]"
              :error-messages="formError.MajorDisciplineCode"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="formState.broadDisciplineId"
              label="Select broad discipline"
              :items="broadDisciplineItems"
              :rules="[requiredValidator]"
              :error-messages="formError.BroadDisciplineId"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.majorDisciplineDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.MajorDisciplineDescription"
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
