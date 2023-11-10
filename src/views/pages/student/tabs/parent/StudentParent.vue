<script setup>
import useStudentContext from "@/context/useStudentContext"
import ParentService from "@/services/parent.service"
import useParentStore from "@/stores/parent.store"
import { computed, onMounted } from "vue"
import ParentModal from "./ParentModal.vue"

// 👉 Table headers
const tableHeaders = ref([
  {
    title: "PARENT/GUARDIAN NAME",
    key: "fullName",
  },
  {
    title: "RELATION",
    key: "relation",
  },
  {
    title: "EMAIL",
    key: "email",
  },
  {
    title: "MOBILE NO",
    key: "mobileNo",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
    width: 120,
  },
])

// 👉 Parent Service
const parentService = new ParentService()

// 👉 Parent store
const parentStore = useParentStore()

// 👉 Context store
const studentContext = useStudentContext

// 👉 Modal visiblity
const isModalVisible = ref(false)

// 👉 Update flag
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

const data = computed(() => {
  return parentStore.getParent
})

async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

async function onUpdate(parent) {
  isModalVisible.value = true
  isUpdateMode.value = true
  parentStore.setField(parent.raw)
}

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await parentService.getParentsByUserId(studentContext.getStudentData.user.id)

    if (code == 200)
    {
      console.log(response)
      parentStore.initialize(response)
    }
  } catch (error) {
    toast.error(error.response?.data ?? error.message)
  }
})

//
</script>

<template>
  <VCard>
    <AppTable
      class="student-parent-table"
      :headers="tableHeaders"
      :items="data"
      style="border-top: none !important;"
    >
      <template #item.action="{ item }">
        <VBtn
          icon=""
          variant="text"
          size="small"
          color="error"
        >
          <VTooltip activator="parent">
            Delete parent
          </VTooltip>
          <VIcon icon="tabler-trash" />
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <AppFab
    icon="tabler-plus"
    label="Add parent or guardian"
    @click="onCreate"
  />

  <ParentModal
    v-model="isModalVisible"
    :is-update-mode="isUpdateMode"
  />
</template>

<style>
.student-parent-table > .v-table__wrapper > table {
  border-block-start: none !important;
}

.student-parent-table .v-table__wrapper {
  border: none !important;
}

.student-parent-table.v-table thead > tr > .v-data-table__td {
  border: none !important;
}

.student-parent-table.v-table tbody .v-data-table__tr > .v-data-table__td {
  border: none !important;
}
</style>
