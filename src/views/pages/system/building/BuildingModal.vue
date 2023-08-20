

<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import BuildingService from "@/services/building.service"
import useBuildingStore from "@/stores/building.store"
import { alphaDashValidator, betweenValidator, integerValidator, requiredValidator } from '@core/utils/validators'
import { cloneDeep } from "lodash"
import { inject, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  campusId: {
    type: [Number, null],
    required: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'success:create',
  'success:update',
  'success:delete',
])

// 👉 Services
const buildingService = new BuildingService()

// 👉 Store
const buildingStore = useBuildingStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
    BuildingName: [],
    BuildingShortName: [],
    BuildingNumber: [],
    BuildingDescription: [],
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return buildingStore.getIsUpdateMode
})

// 👉 Toast
const toast = inject('toast')

// 👉 Swal
const swal = inject("swal")

// 👉 Watch props
watch(props, props => {
  visible.value = props.modelValue
}, { deep: true })

// 👉 Watch visible
watch(visible, visible => {
  emit('update:modelValue', visible)
})

// 👉 Watch building model
watch(visible, async visible => {
  if (!visible) return setTimeout(() => buildingStore.unsetBuildingModel(), 100)

  // Set
  formState.value = cloneDeep(buildingStore.getBuildingModel)

  if (!isUpdateMode.value)
  {
    formState.value.campusId = props.campusId
  }
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const response = await buildingService.createBuilding(formState.value)

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
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 On update campus
async function onUpdate() {
  try {
    const response = await buildingService.updateBuilding(formState.value.id, formState.value)

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

// 👉 On delete campus
async function onDelete() {
  swal.value.fire({
    question: `Delete building "${ formState.value.buildingName }"?`,
    dangerMode: true,
  })
  .then(async result => {
    if (!result) return

    try {
      const response = await buildingService.deleteBuilding(formState.value.id)

      if (response.data.error)
          return toast.error(response.data.errorMessage)

      if (response.status >= 200 && response.status <= 299)
      {
        emit("success:delete", formState.value)
        visible.value = false
      }
      else
      {
        toast.error(response.message)
      }
    } catch (err) {
      formError.value = err.response?.data?.errors ?? formError.value
    }
  })
}
// 
</script>

<template>
  <AppDialog v-model="visible">
    <template #title>
      Building Details
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
              v-model="formState.buildingName"
              label="Building Name"
              :rules="[requiredValidator]"
              :error-messages="formError.BuildingName"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.buildingShortName"
              label="Short Name"
              :rules="[requiredValidator, alphaDashValidator]"
              :error-messages="formError.BuildingShortName"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.buildingNumber"
              label="Building Number"
              :rules="[requiredValidator, integerValidator, betweenValidator(formState.buildingNumber, 1, 999)]"
              :error-messages="formError.BuildingNumber"
            />
          </VCol>
           <VCol cols="12">
            <VTextarea
              v-model="formState.buildingDescription"
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
        v-if="isUpdateMode"
        variant="elevated"
        color="error"
        :block="$vuetify.display.mdAndDown"
        @click="onDelete"
      >
        <VIcon
          start
          icon="tabler-trash"
        />
        DELETE
      </VBtn>
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


