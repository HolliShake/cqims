
<script setup>
import useStudentContext from "@/context/useStudentContext"
import HealthService from "@/services/health.service"
import useHealthStore from "@/stores/health.store"
import { onMounted } from "vue"
import HealthModal from "./HealthModal.vue"

// 👉 Service
const healthService = new HealthService()

// 👉 Store
const healthStore = useHealthStore()

// 👉 Context store
const studentContext = useStudentContext

// 👉 Search
const search = ref("")

// 👉 Modal visiblity
const isModalVisible = ref(false)

// 👉 Update flag
const isUpdateMode = ref(false)

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

const items = computed(() => {
  return healthStore.getHealth
    .filter(h => h.label.toLowerCase().startsWith(search.value.toLowerCase()))
})

async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

async function onUpdate(health) {
  isModalVisible.value = true
  isUpdateMode.value = true
  healthStore.setField(health)
}

async function onDelete(health) {
  swal.value.fire({
    question: "Are you sure you want to delete this health info?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try 
      {
        const { status: code, data: response } = await healthService.deleteHealth(health.id)
        
        if (code >= 200 && code <= 299)
        {
          toast.success("Successfully deleted health info.")
          healthStore.delete(health)
        }
      } catch (error) {
        toast.error(error.response?.data ?? error.message)
      }
    })
}

const th_class = "v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable v-data-table__th v-data-table__th--sortable"
const td_class = "v-data-table__td v-data-table-column--align-start"

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await healthService.getHealthByUserId(studentContext.getStudentData.user.id)

    if (code == 200)
    {
      console.log(response)
      loaded.value = true
      healthStore.initializeHealth(response)
    }
  } catch (error) {
    toast.error(error.response?.data ?? error.message)
  }
})

// 
</script>

<template>
  <VCard>
    <VCardText class="pa-4">
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="search"
            label="Search record"
          />
        </VCol>  
        <VCol
          cols="12"
          md="auto"
          class="ms-auto"
        >
          <VBtn
            block
            @click="onCreate"
          >
            <VIcon
              start
              icon="tabler-location-plus"
            />
            CREATE  
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <AppTable
      :items="items"
      :loading="!loaded"
    >
      <template #body>
        <tr v-if="items.length <= 0">
          <td :class="`text-center ${td_class}`">
            No data available
          </td>
        </tr>
        <tr
          v-for="(item, index) in items"
          v-else
          :key="`item-${index}`"
          @click="onUpdate(item)"
        >
          <th :class="`${th_class} w-25`">
            <div class="v-data-table-header__content">
              <span class="text-uppercase">
                {{ item.label }}  
              </span>
            </div>
          </th> 
          <td :class="`${td_class} w-75`">
            <span class="font-weight-thin">
              {{ item.description }}  
            </span>
          </td> 
          <td :class="`${td_class}`">
            <VBtn
              variant="text"
              icon=""
              size="small"
              color="error"
              @click.stop="onDelete(item)"
            >
              <VTooltip activator="parent">
                Delete health info
              </VTooltip>
              <VIcon icon="tabler-trash" />
            </VBtn>
          </td> 
        </tr>
      </template>
    </AppTable>
  </VCard>

  <HealthModal
    v-model="isModalVisible"
    :is-update-mode="isUpdateMode"
  />
</template>
