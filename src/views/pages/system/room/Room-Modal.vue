<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import RoomService from "@/services/room.service"
import useRoomStore from "@/stores/room.store"
import { alphaDashValidator, betweenValidator, integerValidator, requiredValidator } from '@core/utils/validators'
import { cloneDeep } from "lodash"
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
  buildingId: {
    type: [Number, null],
    required: true,
  },
  floorNumbers: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'update:modelValue',
])

// 👉 Visibility
const visible = ref(false)

// 👉 Watch props
watch(props, props => {
  visible.value = props.modelValue
}, { deep: true })

// 👉 Watch visible
watch(visible, visible => {
  emit('update:modelValue', visible)
})

// ==================================================================

// 👉 Services
const roomService = new RoomService()

// 👉 Store
const roomStore = useRoomStore()

// 👉 Form
const refVForm = ref()

// 👉 Form state
const formState = ref()

// 👉 Form error
const formError = ref({
  RoomNumber: [],
  RoomName: [],
  RoomShortName: [],
  RoomDescription: [],
  FloorNumber: [],
})

// 👉 Computed is update flag
const isUpdateMode = computed(() => props.isUpdateMode)

// 👉 Loaded flag
const loaded = ref(!isUpdateMode.value)

// 👉 Toast
const toast = inject('toast')

// 👉 Watch campus model
watch(visible, async visible => {
  if (!visible) return setTimeout(() => roomStore.unsetRoomModel(), 100)

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
    const { status: code, data: response, message: error } = await roomService.createRoom(formState.value)

    if (code == 200)
    {
      roomStore.appendRoom(response)
      toast.success("Successfully added room.")

      visible.value = false
      await nextTick(() => {
        refVForm.value.reset()
        refVForm.value.resetValidation()
      })
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
    const { status: code, data: response, message: error } = await roomService.updateRoom(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      roomStore.patchRoom(response)
      toast.success("Successfully updated room.")

      visible.value = false
      await nextTick(() => {
        refVForm.value.reset()
        refVForm.value.resetValidation()
      })
    }
    else
    {
      toast.error(error)
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
          <VCol cols="12">
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
              v-model="formState.roomNumber"
              label="Room no."
              :rules="[requiredValidator, integerValidator, betweenValidator(formState.roomNumber ?? '', 1, 100)]"
              :error-messages="formError.RoomNumber"
              :loading="!loaded"
            />
          </VCol>
          <VCol
            cols="12"
            md="7"
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
            <VSelect
              v-model="formState.floorNumber"
              label="Floor No."
              :rules="[requiredValidator, integerValidator]"
              :error-messages="formError.FloorNumber"
              :loading="!loaded"
              :items="props.floorNumbers"
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
          <VCol cols="auto">
            <VSwitch
              v-model="formState.isLaboratory"
              label="Laboratory"
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
