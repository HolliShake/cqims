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
const parentService = new ParentService()
const parentStore = useParentStore()
const studentContext = useStudentContext
const modalRef = ref()
const isLoaded = ref(false)
const toast = inject("toast")
const swal = inject("swal")

const data = computed(() => {
  return parentStore.getParent
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(parent) {
  modalRef.value.openAsUpdateMode(parent.raw)
}

async function onDelete(parent) {
  swal.value.fire({
    question: "Are you sure you want to delete this parent?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try 
      {
        const { status: code, data: response } = await parentService.deleteParent(parent.id)
        
        if (code >= 200 && code <= 299)
        {
          toast.success("Successfully deleted parent.")
          parentStore.delete(parent)
        }
      } catch (error) {
        toast.error(error.response?.data ?? error.message)
      }
    })
}

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await parentService.getParentsByUserId(studentContext.getStudentData.user.id)

    if (code == 200)
    {
      isLoaded.value = true
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
      :loading="!isLoaded"
      style="border-top: none !important;"
      @click:row="onUpdate"
    >
      <template #item.action="{ item }">
        <VBtn
          icon=""
          variant="text"
          size="small"
          color="error"
          @click.stop="onDelete(item.raw)"
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
    ref="modalRef"
  />
</template>

<style>
.student-parent-table > .v-table__wrapper > table {
  border-block-start: none !important;
}

.student-parent-table .v-table__wrapper {
  border: none !important;
}

/*
.student-parent-table.v-table thead > tr > .v-data-table__td {
  border: none !important;
}
*/

.student-parent-table.v-table tbody .v-data-table__tr > .v-data-table__td {
  border: none !important;
}
</style>
