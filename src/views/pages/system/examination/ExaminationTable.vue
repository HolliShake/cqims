<script setup>
import ExaminationService from "@/services/examination.service"
import useExaminationStore from "@/stores/examination.store"
import ExaminationModal from "./ExaminationModal.vue"

// 👉 Table header
const tableHeaders = ref([
  {
    title: "EXAMINATION",
    key: "examinationName",
  },
  {
    title: "DESCRIPTION",
    key: "examinationDescription",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
    width: 100,
  },
])

// 👉 Exam service
const examService = new ExaminationService()

// 👉 Exam store
const examStore = useExaminationStore()

// 👉 Default items per page
const itemsPerPage = ref(10)

// 👉 Search
const search = ref('')

// 👉 Loaded
const loaded = ref(false)

// 👉 Modal visibility
const isModalVisible = ref(false)

// 👉 Updaate flag
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 swal
const swal = inject("swal")

const data = computed(() => {
  return examStore.getExaminations
    .filter(e => e.examinationName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 On create
async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On delete
async function onDelete(examination) {
  swal.value.fire({
    question: `Delete examination "${ examination.examinationName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await examService.deleteExamination(examination.id)

        if (code >= 200 && code <= 299)
        {
          toast.success("Examination successfully deleted.")
          examStore.delete(examination)
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 

    })
}

// 👉 On view
async function onView(examinationRaw) {
  isModalVisible.value = true
  isUpdateMode.value = true
  examStore.setField(examinationRaw.raw)
}

// 👉 Fetch data on mount
onMounted(async () => {
  try {
    const { status: code, data: response, messge: error } = await examService.getAllExamination()

    if (code == 200)
    {
      examStore.setExaminations(response)
      loaded.value = true
    }
    else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
})

// 
</script>


<template>
  <VCard
    rounded="0"
    flat
    border
  >
    <VCardText class="pa-3">
      <VRow>
        <VCol
          cols="8"
          md="3"
        >
          <VTextField
            v-model="search"
            label="Search"
          />  
        </VCol>
        <VCol
          cols="4"
          md="auto"
        >
          <ItemsPerPage
            v-model="itemsPerPage"
            :dense="!!false"
            style="width: 100%;"
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
              icon="tabler-pencil-plus"
            />
            CREATE ENTRY
          </VBtn>  
        </VCol>
      </VRow>  
    </VCardText>
    <AppTable
      :items="data"
      :loading="!loaded"
      :items-per-page="itemsPerPage"
      :headers="tableHeaders"
      @click:row="onView"
    >
      <template #item.action="{ item }">
        <VBtn
          variant="text"
          size="small"
          icon=""
          color="error"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon icon="tabler-trash" />
          <VTooltip>Delete Examination</VTooltip>
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <!-- exam modal create/udpate -->
  <Teleport to="#app">
    <ExaminationModal
      v-model="isModalVisible"
      :is-update-mode="isUpdateMode"
    />  
  </Teleport>
</template>
