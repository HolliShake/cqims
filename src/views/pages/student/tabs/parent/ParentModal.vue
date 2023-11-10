<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import ParentService from "@/services/parent.service"
import useParentStore from "@/stores/parent.store"
import { emailValidator, integerValidator, requiredValidator } from '@core/utils/validators'
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
const parentService = new ParentService()

// 👉 Store
const parentStore = useParentStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  FirstName: [],
  LastName: [],
  Email: [],
  MobileNo: [],
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
  if (!visible) await parentStore.resetField()

  // Set
  formState.value = parentStore.getParentModel
}, { deep: true, immediate: true })

async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await parentService.createParent(formState.value)

    if (code == 200)
    {
      parentStore.add(response)
      toast.success("Successfully created student.")
      
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
    FirstName: [],
    LastName: [],
    Email: [],
    MobileNo: [],
  })
  await nextTick(() => { 
    refVForm.value.resetValidation()
    refVForm.value.reset()
  })
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
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="formState.firstName"
              label="First Name"
              :rules="[requiredValidator]"
              :error-messages="formError.FirstName"
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
              :error-messages="formError.LastName"
            />
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
              v-model="formState.mobileNo"
              label="Mobile no."
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.MobileNo"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.relation"
              label="Relation"
              :rules="[requiredValidator]"
              :error-messages="formError.Relation"
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
