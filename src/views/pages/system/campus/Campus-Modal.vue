<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import CampusService from "@/services/campus.service"
import useCampusStore from "@/stores/campus.store"
import { alphaDashValidator, integerValidator, requiredValidator } from '@core/utils/validators'
import { cloneDeep } from "lodash"
import { inject, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  schoolId: {
    type: [Number, null],
    required: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'success:create',
  'success:update',
])

// 👉 Services
const campusService = new CampusService()

// 👉 Store
const campusStore = useCampusStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  CampusName: [],
  CampusShortName: [],
  CampusDescription: [],
  Barangay: [],
  Province: [],
  City: [],
  Country: [],
  ZipCode: [],
  Region: []
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return campusStore.getIsUpdateMode
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

// 👉 Watch campus model
watch(visible, async visible => {
  if (!visible) return setTimeout(() => campusStore.unsetCampusModel(), 100)

  // Set
  formState.value = cloneDeep(campusStore.getCampusModel)

  if (!isUpdateMode.value)
  {
    formState.value.schoolId = props.schoolId
  }
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const response = await campusService.createCampus(formState.value)

    if (response.data.error)
      return toast.error(response.data.errorMessage)

    if (response.status >= 200 && response.status <= 299)
    {
      emit('success:create', response.data)
      visible.value = false
    }
    else
    {
      toast.error(response.message)
    }
  } catch (err) {
     formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 On update campus
async function onUpdate() {
  try {
    const response = await campusService.updateCampus(formState.value.id, formState.value)

    if (response.data.error)
      return toast.error(response.data.errorMessage)

    if (response.status >= 200 && response.status <= 299)
    {
      emit('success:update', response.data)
      visible.value = false
    }
    else
    {
      toast.error(response.message)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
 }
}
// 
</script>


<template>
  <AppDialog v-model="visible">
    <template #title>
      Campus Details
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
              v-model="formState.campusName"
              label="Campus Name"
              :rules="[requiredValidator]"
              :error-messages="formError.CampusName"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.campusShortName"
              label="Short Name"
              :rules="[requiredValidator, alphaDashValidator]"
              :error-messages="formError.CampusShortName"
            />
          </VCol>
          <VCol cols="12" class="py-0">
            <LabeledDivider title="Location & Address" />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.barangay"
              label="Barangay"
              :rules="[requiredValidator]"
              :error-messages="formError.Barangay"
            />
          </VCol>
           <VCol cols="12">
            <VTextField
              v-model="formState.province"
              label="Province"
              :rules="[requiredValidator]"
              :error-messages="formError.Province"
            />
          </VCol>
          <VCol cols="7" md="4">
            <VTextField
              v-model="formState.city"
              label="City"
              :rules="[requiredValidator]"
              :error-messages="formError.City"
            />
          </VCol>
          <VCol cols="5" md="4">
            <VTextField
              v-model="formState.zipCode"
              label="Zip Code"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.ZipCode"
            />
          </VCol>
          <VCol cols="12" md="4">
            <VTextField
              v-model="formState.region"
              label="Region"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.Region"
            />
          </VCol>
          <VCol cols="12">
           <SelectCountry v-model="formState.country" :error-messages="formError.Country" />
          </VCol>
           <VCol cols="12">
            <VTextarea
              v-model="formState.campusDescription"
              label="Description"
              :rows="2"
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
