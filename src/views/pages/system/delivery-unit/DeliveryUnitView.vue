
<script setup>
import DeliveryUnitService from '@/services/delivery-units.service'
import useDeliveryUnitStore from '@/stores/delivery-unit.store'
import DUAcademicProgramList from "@/views/pages/system/academic-programs/DUAcademicProgramList.vue"
import { cloneDeep } from 'lodash'
import { computed, inject } from 'vue'
import DeliveryUnitModal from './DeliveryUnit-Modal.vue'

// 👉 Du service
const duService = new DeliveryUnitService()

// 👉 Du store 
const duStore = useDeliveryUnitStore()

// 👉 Delivery unit
const selectedDeliveryUnit = inject("selectedDeliveryUnit", ref(null), false)

// 👉 Delivery Unit data
const duData = computed(() => {
  return duStore.find(selectedDeliveryUnit.value)
})

// 👉 Is delivery unit modal visible
const isDeliveryUnitModalVisible = ref(false)

// 👉 Swal
const swal = inject("swal")

// 👉 Toast
const toast = inject("toast")

// 👉 On edit click event
async function onEdit() {
  isDeliveryUnitModalVisible.value = true
  duStore.setField(duData.value)
}

async function onDelete() {
  const du = cloneDeep(duData.value)

  swal.value.fire({
    question: `Delete delivery unit "${ du.deliveryUnitShortName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await duService.deleteDeliveryUnit(du.id)

        if (code >= 200 && code <= 299)
        {
          duStore.delete(du)
          toast.success("Successfully deleted delivery unit.")

          if (duStore.getDeliveryUnits.length > 0)
          {
            selectedDeliveryUnit.value = duStore.getDeliveryUnits[0].id
          }
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 

    })
}

// 
</script>

<template>
  <VCard>
    <VRow>
      <VCol
        cols="12"
        md="auto"
      >
        <div>
          <h2 class="font-weight-bold">
            | {{ duData.deliveryUnitName }}
          </h2>
          <VChip
            class="mt-n1"
            variant="tonal"
            color="warning"
            rounded="sm"
          >
            <span class="text-sm text-disable">{{ duData.deliveryUnitShortName }}</span>  
          </VChip>
        </div>
      </VCol>
      <VCol
        cols="12"
        md="auto"
        class="ms-auto px-6"
      >
        <VBtn
          variant="elevated"
          density="compact"
          icon=""
          color="white"
        >
          <VTooltip activator="parent">
            Delivery Unit Option
          </VTooltip>

          <VIcon icon="tabler-dots-vertical" />
          <VMenu
            activator="parent"
            location="start"
            offset="10"
          >
            <VList>
              <!-- Edit -->
              <VListItem @click="onEdit">
                <template #prepend>
                  <VIcon icon="tabler-pencil" />
                </template>
                <VListItemTitle>Edit</VListItemTitle>
              </VListItem>
              <!-- Delete -->
              <VListItem @click="onDelete">
                <template #prepend>
                  <VIcon icon="tabler-trash" />
                </template>
                <VListItemTitle>Delete</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </VCol>
    </VRow>

    <div class="py-3" />

    <DUAcademicProgramList />
  </VCard>

  <Teleport to="#app">
    <DeliveryUnitModal
      v-model="isDeliveryUnitModalVisible"
      :is-update-mode="!!true"
    />
  </Teleport>
</template>
