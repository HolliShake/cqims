<script setup>
import ProgramCategoryService from "@/services/program-category.service"
import useProgramCategoryStore from "@/stores/program-category.store"
import ProgramCategoryModal from "./ProgramCategoryModal.vue"

// 👉 Table header
const tableHeaders = ref([
  {
    title: "PROGRAM CATEGORY",
    key: "programCategoryName",
  },
  {
    title: "DESCRIPTION",
    key: "programCategoryDescription",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
    width: 100,
  },
])

// 👉 Program category service
const programCategoryService = new ProgramCategoryService()

// 👉 Program category store
const programCategoryStore = useProgramCategoryStore()

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
  return programCategoryStore.getProgramCategories
    .filter(e => e.programCategoryName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 On create
async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On delete
async function onDelete(programCategory) {
  swal.value.fire({
    question: `Delete program category "${ programCategory.programCategoryName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await programCategoryService.deleteProgramCategory(programCategory.id)

        if (code >= 200 && code <= 299)
        {
          toast.success("Program Category successfully deleted.")
          programCategoryStore.delete(programCategory)
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
async function onView(programCategoryRaw) {
  isModalVisible.value = true
  isUpdateMode.value = true
  programCategoryStore.setField(programCategoryRaw.raw)
}

// 👉 Fetch data on mount
onMounted(async () => {
  try {
    const { status: code, data: response, messge: error } = await programCategoryService.getAllProgramCategories()

    if (code == 200)
    {
      programCategoryStore.setProgramCategories(response)
      console.log(response)
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

  <!-- program category modal create/udpate -->
  <Teleport to="#app">
    <ProgramCategoryModal
      v-model="isModalVisible"
      :is-update-mode="isUpdateMode"
    />  
  </Teleport>
</template>
