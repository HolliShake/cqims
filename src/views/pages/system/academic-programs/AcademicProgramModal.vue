<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import AcademicProgramService from "@/services/academic-program.service"
import useAcademicProgramStore from "@/stores/academic-program.store"
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

// 👉 Services
const acadService = new AcademicProgramService()

// 👉 Store
const acadStore = useAcademicProgramStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref({})

// 👉 Form error
const formError = ref({
  ExaminationName: [],
  ExamDescription: [],
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
  if (!visible) return acadStore.resetField()

  // Set
  formState.value = acadStore.getAcademicProgramModel
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await acadService.createAcademicProgram(formState.value)

    if (code >= 200 && code <= 299)
    {
      acadStore.add(response)
      toast.success("Academic Program successfully created.")

      visible.value = false
      reset()
    }
    else
    {
      toast.error(error)
    }
  } catch (err) {
    console.log(err)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 On update campus
async function onUpdate() {

  console.log("asdasd")
  try {
    const { status: code, data: response, message: error } = await acadService.updateAcademicProgram(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      acadStore.update(response)
      toast.success("Academic Program successfully updated.")

      visible.value = false
      reset()
    }
    else
    {
      toast.error(error)
    }
  } catch (err) {
    console.log(err)
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
      Academic Program Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.academicProgramName"
              label="Academic Program Name"
              :rules="[requiredValidator]"
              :error-messages="formError.AcademicProgramName"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.academicProgramShortName"
              label="Short Name"
              :rules="[requiredValidator]"
              :error-messages="formError.AcademicProgramShortName"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.boardResolutionNumber"
              label="Board Resolution No."
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.BoardResolutionNumber"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.notes"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.Notes"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Dates" />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <AppDateTimePicker
              v-model="formState.yearOffered"
              label="Year Offered"
              :error-messages="formError.YearOffered"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <AppDateTimePicker
              v-model="formState.dateApproved"
              label="Date approved"
              :error-messages="formError.DateApproved"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <AppDateTimePicker
              v-model="formState.yearFirstGraduate"
              label="Year first graduated."
              :error-messages="formError.YearFirstGraduate"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Additional Information" />
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
