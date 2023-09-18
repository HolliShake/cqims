<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import CampusService from "@/services/campus.service"
import useCampusStore from "@/stores/campus.store"
import { alphaDashValidator, integerValidator, requiredValidator } from '@core/utils/validators'
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
  Region: [],
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
  if (!visible) return campusStore.resetField()

  // Set
  formState.value = campusStore.getCampusModel
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await campusService.createCampus(formState.value)

    if (code >= 200 && code <= 299)
    {
      campusStore.add(response)
      toast.success("Campus successfully created.")

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
    const { status: code, data: response, message: error } = await campusService.updateCampus(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      campusStore.update(response)
      toast.success("Campus successfully updated.")

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
    CampusName: [],
    CampusShortName: [],
    CampusDescription: [],
    Barangay: [],
    Province: [],
    City: [],
    Country: [],
    ZipCode: [],
    Region: [],
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
      Campus Details
    </template>
    <template #content>
      <VForm ref="refVForm">
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
              :loading="!loaded"
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
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Location & Address" />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.barangay"
              label="Barangay"
              :rules="[requiredValidator]"
              :error-messages="formError.Barangay"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.province"
              label="Province"
              :rules="[requiredValidator]"
              :error-messages="formError.Province"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="7"
            md="4"
          >
            <VTextField
              v-model="formState.city"
              label="City"
              :rules="[requiredValidator]"
              :error-messages="formError.City"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="5"
            md="4"
          >
            <VTextField
              v-model="formState.zipCode"
              label="Zip Code"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.ZipCode"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="4"
          >
            <VTextField
              v-model="formState.region"
              label="Region"
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.Region"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <SelectCountry
              v-model="formState.country"
              :error-messages="formError.Country"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.campusDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.Description"
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
