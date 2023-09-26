<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import SubDisciplineService from "@/services/sub-discipline.service"
import MajorDisciplineService from "@/services/major-discipline.service"
import useSubDisciplineStore from "@/stores/sub-discipline.store"
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
const subDisciplineService = new SubDisciplineService()

// 👉 Store
const subDisciplineStore = useSubDisciplineStore()

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

// 👉 Major discipline items
const majorDisciplineItems = computedAsync(async () => {
  return await (new MajorDisciplineService()).getAllMajorDiscipline()
    .then(res => {
      if (res.data.constructor.name != "Array") return []

      return res.data.map(bd => ({
        title: bd.majorDisciplineCode,
        value: bd.id,
      }))
    })
    .catch(err => [])
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
  if (!visible) return subDisciplineStore.resetField()

  // Set
  formState.value = subDisciplineStore.getSubDisciplineModel
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
    const { status: code, data: response, message: error } = await subDisciplineService.createSubDiscipline(formState.value)

    if (code >= 200 && code <= 299)
    {
      subDisciplineStore.add(response)
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
    const { status: code, data: response, message: error } = await subDisciplineService.updateSubDiscipline(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      subDisciplineStore.update(response)
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
      Sub Discipline Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.subDisciplineCode"
              label="Sub discipline code"
              :rules="[requiredValidator]"
              :error-messages="formError.SubDisciplineCode"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="formState.majorDisciplineId"
              label="Select major discipline"
              :items="majorDisciplineItems"
              :rules="[requiredValidator]"
              :error-messages="formError.MajorDisciplineId"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.subDisciplineDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.SubDisciplineDescription"
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
