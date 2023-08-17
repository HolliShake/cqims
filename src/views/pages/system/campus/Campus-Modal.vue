<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import { helpers } from "@/helpers"
import CampusService from "@/services/campus.service"
import useCampusStore from "@/stores/campus.store"
import { alphaValidator, requiredValidator } from '@core/utils/validators'
import { cloneDeep } from "lodash"
import { inject, watch } from "vue"

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
const campusService = new CampusService()

// 👉 Store
const campusStore = useCampusStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Submitted
const submitted = ref(false)

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  Barangay: [],
  City: [],
  Province: [],
  Region: [],
  Country: [],
  CampusName: [],
  CampusShortName: [],
  ZipCodeId: [],
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

// 👉 Watch school model
watch(visible, visible => {
  if (!visible) return setTimeout(() => campusStore.unsetCampusModel(), 100)

  // Set
  formState.value = cloneDeep(campusStore.getCampusModel)

  if (isUpdateMode.value)
  {
    const zipCode = formState.value.zipCode
    delete formState.value['zipCode']
    formState.value = {
      ...(formState.value),
      ...(zipCode)
    }
  }
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate() && submitted.value) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const response = await campusService.createCampus(formState.value)

    if (response.status >= 200 && response.status <= 299)
    {
      emit('success:create', response.data)
      visible.value = false
    }
    else
    {
      toast.error(response.response?.data?.errors ?? "Error")
    }
  } catch (err) {
    console.log(err);
    toast.error(err.message)
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 On update campus
async function onUpdate() {
  try {
    const response = await schoolService.updateSchool(formState.value.id, formState.value)

    if (response.status >= 200 && response.status <= 299)
    {
      emit('success:update', response.data)
      visible.value = false
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
        v-model="submitted"
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
              :error-messages="formError.campusName"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.campusShortName"
              label="Short Name"
              :rules="[requiredValidator, alphaValidator]"
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
          <VCol cols="7">
            <VTextField
              v-model="formState.city"
              label="City"
              :rules="[requiredValidator]"
              :error-messages="formError.City"
            />
          </VCol>
          <VCol cols="5">
            <VTextField
              v-model="formState.region"
              label="Region"
              :rules="[requiredValidator]"
              :error-messages="formError.Region"
            />
          </VCol>
          <VCol cols="12">
           <SelectCountry v-model="formState.country" />
          </VCol>
        </VRow>
      </VForm>
    </template>
    <template #actions>
      <VBtn
        variant="elevated"
        :color="(!isUpdateMode) ? 'primary' : 'secondary'"
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
