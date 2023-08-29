<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import RoomService from "@/services/room.service"
import useRoomStore from "@/stores/room.store"
import { integerValidator, alphaDashValidator, requiredValidator } from '@core/utils/validators'
import { cloneDeep } from "lodash"
import { inject, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  buildingId: {
    type: [Number, null],
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'success:create',
  'success:update',
])

// 👉 Services
const roomService = new RoomService()

// 👉 Store
const roomStore = useRoomStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  RoomName: [],
  RoomShortName: [],
  RoomDescription: [],
  FloorNumber: [],
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return roomStore.getIsUpdateMode
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
  if (!visible) return setTimeout(() => campusStore.unsetCampusModel(), 100)

  // Set
  formState.value = cloneDeep(roomStore.getRoomModel)

  if (!isUpdateMode.value)
  {
    formState.value.buildingId = props.buildingId
  } else {
    loaded.value = false
    try {
      const response = await roomService.getRoomById(formState.value.id)

      if (response.status === 200)
      {
        formState.value = cloneDeep(response.data)
        loaded.value = true
      }
      else
      {
        toast.error(response.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }
}, { deep: true })

// 👉 On submit
async function onSubmit() {
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() {
  try {
    const response = await roomService.createRoom(formState.value)

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
      Room Details
    </template>
    <template #content>
      <VForm ref="refVForm">
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.roomName"
              label="Room Name"
              :rules="[requiredValidator]"
              :error-messages="formError.RoomName"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="5"
          >
            <VTextField
              v-model="formState.roomShortName"
              label="Short Name"
              :rules="[requiredValidator, alphaDashValidator]"
              :error-messages="formError.RoomShortName"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.floorNumber"
              label="Floor No."
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.FloorNumber"
              :loading="!loaded"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.roomDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :error-messages="formError.RoomDescription"
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
