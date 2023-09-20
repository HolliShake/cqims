<script setup>
import AcademicTermService from "@/services/academic-term.service"
import useAcademicTermStore from "@/stores/academic-term.store"
import AcademicTermnModal from "./AcademicTermModal.vue"

// 👉 Table header
const tableHeaders = ref([
  {
    title: "ACADEMIC TERM",
    key: "academicTermName",
  },
  {
    title: "G1 LABEL",
    key: "grade1Label",
  },
  {
    title: "G2 LABEL",
    key: "grade2Label",
  },
  {
    title: "G3 LABEL",
    key: "grade3Label",
  },
  {
    title: "G4 LABEL",
    key: "grade4Label",
  },
  {
    title: "ORDER",
    key: "semOrder",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
    width: 100,
  },
])

// 👉 Academic term service
const academicTermService = new AcademicTermService()

// 👉 Academic term store
const academicTermStore = useAcademicTermStore()

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
  return academicTermStore.getAcademicTerms
    .filter(a => a.academicTermName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 On create
async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On delete
async function onDelete(academicTerm) {
  swal.value.fire({
    question: `Delete academic term "${ academicTerm.academicTermName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await academicTermService.deleteAcademicTerm(academicTerm.id)

        if (code >= 200 && code <= 299)
        {
          toast.success("Academic term successfully deleted.")
          academicTermStore.delete(academicTerm)
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
async function onView(academicTermRaw) {
  isModalVisible.value = true
  isUpdateMode.value = true
  academicTermStore.setField(academicTermRaw.raw)
}

// 👉 Fetch data on mount
onMounted(async () => {
  try {
    const { status: code, data: response, messge: error } = await academicTermService.getAllAcademicTerm()

    if (code == 200)
    {
      academicTermStore.setAcademicTerms(response)
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
          <VTooltip>Delete Academic Term</VTooltip>
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <!-- Academic term modal create/udpate -->
  <Teleport to="#app">
    <AcademicTermnModal
      v-model="isModalVisible"
      :is-update-mode="isUpdateMode"
    />  
  </Teleport>
</template>
