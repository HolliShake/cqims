<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import CourseService from "@/services/course.service"
import SubDisciplineService from "@/services/sub-discipline.service"
import useCourseStore from "@/stores/course.store"
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
const courseService = new CourseService()

// 👉 Store
const courseStore = useCourseStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  CourseName: [],
  CourseCode: [],
  CourseDescription: [],
  UnitsLab: [],
  UnitsLec: [],
  CreditsUnit: [],
  CreditHoursLab: [],
  CreditHoursLec: [],
  CreditHours: [],
  SubDisciplineId: [],
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
const subDisciplineItems = computedAsync(async () => {
  try {
    const { status: code, data: response } = await (new SubDisciplineService()).getAllSubDiscipline()

    if (code == 200)
    {
      return response
        .map(sd => ({
          title: sd.subDisciplineCode,
          value: sd.id,
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
  if (!visible) return courseStore.resetField()

  // Set
  formState.value = courseStore.getCourseModel
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
    const { status: code, data: response, message: error } = await courseService.createCourse(formState.value)

    if (code >= 200 && code <= 299)
    {
      courseStore.add(response)
      toast.success("Course successfully created.")

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
    const { status: code, data: response, message: error } = await courseService.updateCourse(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      courseStore.update(response)
      toast.success("Course successfully updated.")

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
    CourseName: [],
    CourseCode: [],
    CourseDescription: [],
    UnitsLab: [],
    UnitsLec: [],
    CreditsUnit: [],
    CreditHoursLab: [],
    CreditHoursLec: [],
    CreditHours: [],
    SubDisciplineId: [],
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
      Course Details
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
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.courseName"
              label="Course Name"
              :rules="[requiredValidator]"
              :error-messages="formError.CourseName"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.courseCode"
              label="Course Code"
              :rules="[requiredValidator]"
              :error-messages="formError.CourseCode"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.courseDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.CourseDescription"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Other details" />
          </VCol>
          <VCol cols="12">
            <VSelect
              v-model="formState.subDisciplineId"
              label="Select sub discipline"
              :items="subDisciplineItems"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.SubDisciplineId"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.unitsLab"
              label="Unit (Lab)"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.UnitsLab"
            />
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.creditHoursLab"
              label="Credit hours (Lab)"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.CreditHoursLab"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.unitsLec"
              label="Unit (Lec)"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.UnitsLec"
            />
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.creditHoursLec"
              label="Credit hours (Lec)"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.CreditHoursLec"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.creditHours"
              label="Credit hours"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.CreditHours"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.creditsUnit"
              label="Credits unit"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.CreditsUnit"
            />
          </VCol>
          <VCol cols="auto">
            <VCheckbox
              v-model="formState.isWithLab"
              label="With Laboratory"
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
