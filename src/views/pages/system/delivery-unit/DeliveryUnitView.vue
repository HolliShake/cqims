<script setup>
import { helpers } from '@/helpers'
import DeliveryUnitService from '@/services/delivery-units.service'
import DepartmentService from '@/services/department.service'
import useDeliveryUnitStore from '@/stores/delivery-unit.store'
import useDepartmentStore from '@/stores/department.store'
import { cloneDeep } from 'lodash'
import { computed, inject } from 'vue'
import DepartmentModal from '../department/DepartmentModal.vue'
import DeliveryUnitModal from './DeliveryUnit-Modal.vue'

// 👉 Du service
const duService = new DeliveryUnitService()

// 👉 Du store 
const duStore = useDeliveryUnitStore()

// 👉 Department service
const departmentService = new DepartmentService()

// 👉 Department store
const departmentStore = useDepartmentStore()

// 👉 Delivery unit
const selectedDeliveryUnit = inject("selectedDeliveryUnit", ref(null), false)

// 👉 Delivery Unit data
const duData = computed(() => {
  return duStore.find(selectedDeliveryUnit.value)
})

// 👉 Is delivery unit modal visible
const isDeliveryUnitModalVisible = ref(false)

// 👉 Department modal ref
const departmentModalRef = ref(null)

// 👉 Department loaded
const isDepartmentLoaded = ref(false)

// 👉 Search
const search = ref("")

// 👉 Swal
const swal = inject("swal")

// 👉 Toast
const toast = inject("toast")

// 👉 Departments
const departments = computed(() => {
  return departmentStore.getDepartments
    .filter(department => department.departmentName.toLowerCase().includes(search.value.toLowerCase()))
    .sort((a, b) => a.departmentName.length - b.departmentName.length)
})

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

async function onCreateDepartment() {
  departmentModalRef.value.open()
}

async function onUpdateDepartment(department) {
  departmentModalRef.value.openAsUpdateMode(department)
}

async function onDeleteDepartment(department) {
  swal.value.fire({
    question: `Delete department "${ department.departmentName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code } = await departmentService.deleteDepartment(department.id)

        if (code >= 200 && code <= 299)
        {
          departmentStore.delete(department)
          toast.success("Successfully deleted department.")
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 

    })
}

watch(selectedDeliveryUnit, async du => {
  departmentStore.setDeliveryUnit(du)

  try {
    const { status: code, data: response } = await departmentService.getDepartmentByDeliveryUnitId(du)

    if (code == 200) {
      departmentStore.initialize(response)
      isDepartmentLoaded.value = true
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
}, { deep: true, immediate: true })

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
    <div class="d-flex flex-row flex-nowrap gap-3 w-100 py-4 text-end">
      <VTextField 
        v-model="search"
        label="Search" 
      />
      <VBtn @click="onCreateDepartment">
        <VIcon 
          start
          icon="tabler-location-plus"
        />
        ADD DEPARTMENT
      </VBtn>
    </div>
    <VList border>
      <template v-if="!isDepartmentLoaded">
        <VSkeletonLoader
          type="list-item@4"
          :loading="!isDepartmentLoaded"
        />
      </template>
      <template v-else>
        <VListItem v-if="departments.length <= 0">
          <p class="text-center ma-0">
            No Data Available.
          </p>
        </VListItem>
        <template
          v-for="(department, index) in departments"
          :key="`department-${index}`"
        >
          <VListItem @click="onUpdateDepartment(department)">
            <VListItemTitle>
              <span class="text-uppercase font-weight-bold">
                {{ department.departmentName }}
              </span>
            </VListItemTitle>

            <template #append>
              <div class="d-flex flex-row flex-nowrap gap-2">
                <VBtn
                  icon=""
                  variant="text"
                  color="error"
                  size="x-small"
                  @click.stop="onDeleteDepartment(department)"
                >
                  <VIcon icon="tabler-trash" />
                  <VTooltip activator="parent">
                    Delete department
                  </VTooltip>
                </VBtn>

                <RouterLink
                  :to="{
                    name: 'system-schools-id-campuses-campusid-delivery-units-departmentid',
                    params: {
                      departmentid: helpers.security.encrypt(department.id)
                    },
                    props: true
                  }"
                >
                  <VBtn
                    icon=""
                    variant="tonal"
                    color="success"
                    size="x-small"
                    @click.stop="$event => null"
                  >
                    <VIcon icon="tabler-chevron-right" />
                    <VTooltip activator="parent">
                      Visit programs
                    </VTooltip>
                  </VBtn>
                </RouterLink>
              </div>
            </template>
          </VListItem>

          <VDivider v-if="index < departments.length - 1" />
        </template>
      </template>
    </VList>
  </VCard>

  <Teleport to="#app">
    <DeliveryUnitModal
      v-model="isDeliveryUnitModalVisible"
      :is-update-mode="!!true"
    />

    <DepartmentModal ref="departmentModalRef" />
  </Teleport>
</template>
