<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import AcademicTermService from "@/services/academic-term.service"
import useAcademicTermStore from "@/stores/academic-term.store"
import { integerValidator, requiredValidator } from '@core/utils/validators'
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

// 👉 Academic term service
const academicTermService = new AcademicTermService()

// 👉 Academic term store
const academicTermStore = useAcademicTermStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  AcademicTermName: [],
  SemOrder: [],
  Grade1Label: [],
  Grade2Label: [],
  Grade3Label: [],
  Grade4Label: [],
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
  if (!visible) return academicTermStore.resetField()

  // Set
  formState.value = academicTermStore.getAcademicTermModel
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await academicTermService.createAcademicTerm(formState.value)

    if (code >= 200 && code <= 299)
    {
      academicTermStore.add(response)
      toast.success("Academic term successfully created.")

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
    const { status: code, data: response, message: error } = await academicTermService.updateAcademicTerm(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      academicTermStore.update(response)
      toast.success("Academic term successfully updated.")

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
    ExaminationName: [],
    ExamDescription: [],
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
      Academic Term Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
            md="8"
          >
            <VTextField
              v-model="formState.academicTermName"
              label="Academic Term Name"
              :rules="[requiredValidator]"
              :error-messages="formError.AcademicTermName"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="formState.semOrder"
              label="Sem Order"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.SemOrder"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.grade1Label"
              label="Grade 1 Label"
              :rules="[requiredValidator]"
              :error-messages="formError.Grade1Label"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.grade2Label"
              label="Grade 2 Label"
              :rules="[requiredValidator]"
              :error-messages="formError.Grade2Label"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.grade3Label"
              label="Grade 3 Label"
              :rules="[requiredValidator]"
              :error-messages="formError.Grade3Label"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.grade4Label"
              label="Grade 4 Label"
              :rules="[requiredValidator]"
              :error-messages="formError.Grade4Label"
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
