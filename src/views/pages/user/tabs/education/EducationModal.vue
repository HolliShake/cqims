<script setup>
import AppDateTimePicker from "@/@core/components/app-form-elements/AppDateTimePicker.vue"
import HealthService from "@/services/health.service"
import useEducationStore from "@/stores/education.store"
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
const healthService = new HealthService()

// 👉 Store
const educationStore = useEducationStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  SchoolName: [],
  From: [],
  To: [],
  Description: [],
  Status: [],
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
  if (!visible) await educationStore.resetField()

  // Set
  formState.value = educationStore.getEducationModel
}, { deep: true, immediate: true })

async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await healthService.createHealth(formState.value)

    if (code == 200)
    {
      educationStore.add(response)
      toast.success("Successfully created health.")
      
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
  try 
  {
    const { status: code, data: response, message: error } = await healthService.updateHealth(formState.value.id, formState.value)
    
    if (code >= 200 && code <= 299)
    {
      healthStore.update(response)
      toast.success("Successfully updated health.")

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
    SchoolName: [],
    From: [],
    To: [],
    Description: [],
    Status: [],
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
      Education Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="formState.schoolName"
              label="School"
              :rules="[requiredValidator]"
              :error-messages="formError.Label"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Date & Other Information" />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="formState.from"
              label="From"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="formState.to"
              label="To"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.description"
              label="Description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.Description"
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
