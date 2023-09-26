<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import AcademicTermService from "@/services/academic-term.service"
import CurriculumService from "@/services/curriculum.service"
import useCurriculumStore from "@/stores/curriculum.store"
import { betweenValidator, integerValidator, requiredValidator } from '@core/utils/validators'
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
const curriculumService = new CurriculumService()

// 👉 Store
const curriculumStore = useCurriculumStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  CurriculumName: [],
  ProgramType: [],
  Major: [],
  Minor: [],
  TotalSemesters: [],
  YearFirstImplemented: [],
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return props.isUpdateMode
})

// 👉 Loaded flag
const loaded = ref(!isUpdateMode.value)

// 👉 Toast
const toast = inject('toast')

// 👉 Academic term items
const academicTermItems = computedAsync(async () => {
  try {
    const { status: code, data: response } = await (new AcademicTermService()).getAllAcademicTerm()

    if (code == 200)
    {
      return response
        .map(at => ({
          title: at.academicTermName,
          value: at.id,
        }))
    }
  } catch(err) {}

  return []
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
  if (!visible) return curriculumStore.resetField()

  // Set
  formState.value = curriculumStore.getCurriculumModel
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await curriculumService.createCurriculum(formState.value)

    if (code >= 200 && code <= 299)
    {
      curriculumStore.add(response)
      toast.success("Curriculum successfully created.")

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
    const { status: code, data: response, message: error } = await curriculumService.updateCurriculum(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      curriculumStore.update(response)
      toast.success("Curriculum successfully updated.")

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
    CurriculumName: [],
    ProgramType: [],
    Major: [],
    Minor: [],
    MinScore: [],
    TotalSemesters: [],
    YearFirstImplemented: [],
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
      Curriculum Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Basic Information" />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.curriculumName"
              label="Curriculum Name"
              :rules="[requiredValidator]"
              :error-messages="formError.CurriculumName"
              readonly
              :loading="!loaded"
              hint="readonly field"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.programType"
              label="Program Type"
              :rules="[requiredValidator]"
              :error-messages="formError.ProgramType"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.major"
              label="Major"
              :rules="[requiredValidator]"
              :error-messages="formError.Major"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.minor"
              label="Minor"
              :rules="[requiredValidator]"
              :error-messages="formError.Minor"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.minScore"
              label="Min score"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.MinScore"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="formState.academicTermId"
              label="Select academic term"
              :items="academicTermItems"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.AcademicTermId"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Other details" />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <AppTextField
              v-model="formState.totalSemesters"
              label="Total semesters"
              :rules="[requiredValidator, integerValidator, betweenValidator(formState.totalSemesters, 1, 4)]"
              :error-messages="formError.TotalSemesters"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="formState.yearFirstImplemented"
              label="Year First Implemented"
              :rules="[requiredValidator]"
              :error-messages="formError.YearFirstImplemented"
            />
          </VCol>
          <VCol cols="auto">
            <VCheckbox
              v-model="formState.isDefault"
              label="Is Default"
            />
          </VCol>
          <VCol cols="auto">
            <VCheckbox
              v-model="formState.isActive"
              label="Is Active"
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
