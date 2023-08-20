<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import { helpers } from "@/helpers"
import SchoolService from "@/services/school.service"
import useSchoolStore from "@/stores/school.store"
import { alphaDashValidator, requiredValidator } from '@core/utils/validators'
import { cloneDeep } from "lodash"
import { inject, nextTick, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'success:create',
  'success:update',
])

// 👉 Services
const schoolService = new SchoolService()

// 👉 Store
const schoolStore = useSchoolStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  SchoolName: [],
  SchoolShortName: [],
  SchoolNumber: [],
  SchoolDescription: [],
})

const isUpdateMode = computed(() => { 
  return schoolStore.getIsUpdateMode
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

// 👉 Watch school model
watch(visible, async visible => {
  if (!visible) return setTimeout(() => schoolStore.unsetSchoolModel(), 100)

  // Set
  formState.value = cloneDeep(schoolStore.getSchoolModel)
}, { deep: true })

async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const response = await schoolService.createSchool(formState.value)

    if (response.status >= 200 && response.status <= 299)
    {
      emit('success:create', response.data)
      visible.value = false
      reset()
    }
    else
    {
      toast.error(response.response?.data?.errors ?? "Error")
    }
  } catch (err) {
    toast.error(err.message)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function onUpdate() {
  try {
    const response = await schoolService.updateSchool(formState.value.id, formState.value)

    if (response.status >= 200 && response.status <= 299)
    {
      emit('success:update', response.data)
      visible.value = false
      reset()
    }
    else
    {
      toast.error(response.response?.data?.errors ?? "Error")
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 Reset
async function reset() {
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
      School Details
    </template>
    <template #content>
      <VForm
        ref="refVForm"
      >
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.schoolName"
              label="School Name"
              :rules="[requiredValidator]"
              :error-messages="formError.SchoolName"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.schoolShortName"
              label="Short Name"
              :rules="[requiredValidator, alphaDashValidator]"
              :error-messages="formError.SchoolShortName"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.schoolNumber"
              label="School Number"
              :rules="[requiredValidator]"
              :error-messages="formError.SchoolNumber"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.schoolDescription"
              label="Description"
              :rules="[requiredValidator]"
              :rows="2"
              auto-grow
              :error-messages="formError.SchoolDescription"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions>
      <RouterLink
        v-if="isUpdateMode"
        :to="{
          name: 'system-schools-id-campuses',
          params: { id: helpers.security.encrypt(formState.id) },
          props: true,
        }"
      >
        <VBtn
          variant="tonal"
          :block="$vuetify.display.mdAndDown"
          @click="setSelectedSchool"
        >
          <VIcon
            start
            icon="tabler-map-pins"
          />
          View Campuses
        </VBtn>
      </RouterLink>
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
