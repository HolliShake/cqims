<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue"
import StudentService from '@/services/student.service'
import useStudentStore from "@/stores/student.store"
import { betweenValidator, emailValidator, requiredValidator } from '@core/utils/validators'
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
const studentService = new StudentService()

// 👉 Store
const studentStore = useStudentStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  Email: [],
  Username: [],
  Password: [],
  FirstName: [],
  LastName: [],
  BirthDate: [],
  StudentId: [],
})

const isUpdateMode = computed(() => { 
  return props.isUpdateMode
})

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

// ==================================================================

// 👉 Watch school model
watch(visible, async visible => {
  if (!visible) await studentStore.resetField()

  // Set
  formState.value = studentStore.getStudentModel
}, { deep: true, immediate: true })

// 👉 Watch state
watch(formState, formState => {
  if (formState.lastName?.length > 0 && formState.studentId?.length > 0) 
  {
    formState.password = `${formState.lastName}@${formState.studentId}`
    formState.confirmPassword = `${formState.lastName}@${formState.studentId}`
  }
}, { deep: true })

async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await studentService.createStudent(formState.value)

    if (code == 200)
    {
      studentStore.add(response)
      toast.success("Successfully created student.")
      
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

async function onUpdate() {
  try {
    const { status: code, data: response, message: error } = await studentService.updateStudent(formState.value.id, formState.value)
    
    if (code >= 200 && code <= 299)
    {
      studentStore.update(response)
      toast.success("Successfully updated student.")

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

// 👉 Reset
async function reset() {
  formError.value = ({
    Email: [],
    Username: [],
    Password: [],
    FirstName: [],
    LastName: [],
    BirthDate: [],
    StudentId: [],
  })
  await nextTick(() => { 
    refVForm.value.resetValidation()
    refVForm.value.reset()
  })
}

// 👉 Set selected school
async function setSelectedSchool() {
  localStorage.setItem("selectedSchool", JSON.stringify(formState.value))
}

// 
</script>


<template>
  <AppDialog v-model="visible">
    <template #title>
      Student Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <LabeledDivider title="Basic Information" />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.firstName"
              label="First Name"
              :rules="[requiredValidator]"
              :error-messages="formError.firstName"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.lastName"
              label="Last Name"
              :rules="[requiredValidator]"
              :error-messages="formError.lastName"
            />
          </VCol>
          <VCol cols="12">
            <AppDateTimePicker
              v-model="formState.birthDate"
              label="Birth Date"
            />
          </VCol>
          <VCol cols="12">
            <LabeledDivider title="Authentication & Identification" />
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.email"
              label="Email"
              :rules="[requiredValidator, emailValidator]"
              :error-messages="formError.Email"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.username"
              label="Username"
              :rules="[requiredValidator]"
              :error-messages="formError.Username"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.password"
              label="Password"
              :rules="[props.isUpdateMode ? () => true : requiredValidator, props.isUpdateMode ? () => true : betweenValidator(formState.password?.length, 8, 30)]"
              :error-messages="formError.Password"
              type="password"
              new
              autocomplete="new-password"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.confirmPassword"
              label="Confirm Password"
              :rules="[props.isUpdateMode ? () => true : requiredValidator, props.isUpdateMode ? () => true : () => (formState.password == formState.confirmPassword) || 'Password does not match']"
              type="password"
              new
              autocomplete="new-password"
            />
          </VCol>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.studentId"
              :label="`StudentID (${new Date(Date.now()).getFullYear()}xxxxxx)`"
              :rules="[requiredValidator]"
              :error-messages="formError.StudentId"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions>
      <VBtn
        variant="elevated"
        :color="(!isUpdateMode) ? 'primary' : 'secondary'"
        :class="$vuetify.display.mdAndDown ? 'mt-5' : 'ms-3'"
        :block="$vuetify.display.mdAndDown"
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
