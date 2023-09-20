<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import { helpers } from "@/helpers"
import CampusService from "@/services/campus.service"
import { alphaDashValidator, integerValidator, requiredValidator } from '@core/utils/validators'
import { inject, watch } from "vue"

const properties = defineProps({
  campusId: {
    type: [Number, null],
    required: true,
  },
  context: {
    type: String,
    required: true,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const { y } = useWindowScroll()

// 👉 Services
const campusService = new CampusService()

// 👉 Visibility
const visible = ref(false)

// 👉 Form state
const formState = ref({})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const toast = inject('toast')

// 👉 Button ref
const btnRef = ref()

// 👉 Default buttom
const defaultBottom = ref("5%")

// 👉 Label
const label = computed(() => {
  switch (properties.context.toLowerCase()) 
  {
  case "delivery-unit": 
    return "SHOW BUILDINGS"
  case "buildings": 
    return "SHOW DELIVERY UNITS"
  }

  return "INVALID CONTEXT"
})

// 👉 Computed navigation
const toLink = computed(() => {
  const INVALID_LINK = ({ name: "system-schools" })
  
  if (!(loaded.value || formState.value.id)) return INVALID_LINK
  
  switch (properties.context.toLowerCase()) 
  {
  case "delivery-unit": 
    return ({
      name: "system-schools-id-campuses-campusid-buildings",
      params: {
        id: helpers.security.encrypt(formState.value.schoolId),
        campusid: helpers.security.encrypt(formState.value.id),
      },
      props: true,
    })
  case "buildings": 
    return ({
      name: "system-schools-id-campuses-campusid-delivery-units",
      params: {
        id: helpers.security.encrypt(formState.value.schoolId),
        campusid: helpers.security.encrypt(formState.value.id),
      },
      props: true,
    })
  }

  return INVALID_LINK
})

// 👉 Watch campus model
watch(visible, async visible => {
  if (!(visible && properties.campusId)) return

  try {
    const { status: code, data: response, message: error } = await campusService.getCampusById(properties.campusId)

    if (code == 200)
    {
      localStorage.setItem("selectedCampus", JSON.stringify(response))

      formState.value = response
      loaded.value = true
    }
    else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
}, { deep: true })

// 👉 Watch scroll
watch(y, value => {
  if (!btnRef.value) return

  if (value > 200)
  {
    // 5% := default bottom, 38 := button height, 5 := gap
    btnRef.value.$el.nextElementSibling.style["insetBlockEnd"] = `calc(5% + ${38 + 5}px)`
  } 
  else if (value <= 200)
  {
    btnRef.value.$el.nextElementSibling.style["insetBlockEnd"] = defaultBottom.value
  }
}, { deep: true })

// 
</script>


<template>
  <VDialog
    ref="btnRef"
    v-model="visible"
    class="v-dialog-sm"
    persistent
  >
    <template #activator="{ props }">
      <VBtn
        ref="btnRef"
        class="campus-info-activator-btn"
        v-bind="props"
        variant="elevated"
        color="success"
        icon=""
        density="comfortable"
      >
        <VTooltip activator="parent">
          Current Campus information
        </VTooltip>

        <VIcon
          icon="tabler-question-mark"
          size="22"
        />
      </VBtn>
    </template>
    
    <DialogCloseBtn @click="visible = false" />

    <VCard>
      <VCardTitle
        class="text-center"
        style=" user-select: none;"
      >
        Campus Information
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="7"
          >
            <VTextField
              v-model="formState.campusName"
              label="Campus Name"
              :rules="[requiredValidator]"
              :loading="!loaded"
              readonly
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
              :loading="!loaded"
              readonly
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
              :loading="!loaded"
              readonly
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="formState.province"
              label="Province"
              :rules="[requiredValidator]"
              :loading="!loaded"
              readonly
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
              :loading="!loaded"
              readonly
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
              :loading="!loaded"
              readonly
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
              :loading="!loaded"
              readonly
            />
          </VCol>
          <VCol cols="12">
            <SelectCountry
              v-model="formState.country"
              readonly
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="formState.campusDescription"
              label="Description"
              :rows="2"
              auto-grow
              :rules="[requiredValidator]"
              :loading="!loaded"
              readonly
            />
          </VCol>
        </VRow>
      </VCardText>
      <VCardText class="pa-5 text-center">
        <RouterLink :to="toLink">
          <VBtn color="success">
            {{ label }}
          </VBtn>
        </RouterLink>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.campus-info-activator-btn {
  position: fixed !important;
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 25px;
}
</style>
