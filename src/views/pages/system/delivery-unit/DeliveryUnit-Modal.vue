
<script setup>
import DeliveryUnitService from "@/services/delivery-units.service"
import useDeliveryUnitStore from "@/stores/delivery-unit.store"
import { alphaDashValidator, requiredValidator } from '@core/utils/validators'
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
const duService = new DeliveryUnitService()

// 👉 Store
const duStore = useDeliveryUnitStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  DeliveryUnitName: [],
  DeliveryUnitShortName: [],
  DeliveryUnitDescription: [],
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
  if (!visible) return duStore.resetField()

  // Set
  formState.value = duStore.getDeliveryUnitModel
}, { deep: true })

async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

async function onCreate() {
  try {
    const { status: code, data: response, message: error } = await duService.createDeliveryUnit(formState.value)

    if (code == 200)
    {
      duStore.add(response)
      toast.success("Successfully created delivery unit.")
      
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
    const { status: code, data: response, message: error } = await duService.updateDeliveryUnit(formState.value.id, formState.value)
    
    if (code >= 200 && code <= 299)
    {
      duStore.update(response)
      toast.success("Successfully updated delivery unit.")

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
    DeliveryUnitName: [],
    DeliveryUnitShortName: [],
    DeliveryUnitDescription: [],
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
      Delivery Unit Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.deliveryUnitName"
              label="Delivery Unit Name"
              :rules="[requiredValidator]"
              :error-messages="formError.DeliveryUnitName"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.deliveryUnitShortName"
              label="Short Name"
              :rules="[requiredValidator, alphaDashValidator]"
              :error-messages="formError.DeliveryUnitShortName"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.deliveryUnitDescription"
              label="Description"
              :rules="[requiredValidator]"
              :rows="2"
              auto-grow
              :error-messages="formError.DeliveryUnitDescription"
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
