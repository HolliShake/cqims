<script setup>
import { helpers } from "@/helpers"
import AcademicProgramService from "@/services/academic-program.service"
import useAcademicProgramStore from "@/stores/academic-program.store"
import { inject } from "vue"
import AcademicProgramModal from "./AcademicProgramModal.vue"

const tableHeaders = ref([
  {
    title: "PROGRAM NAME",
    key: "academicProgramName",
  },
  {
    title: "PROGRAM CATEGORY",
    key: "programCategory.programCategoryName",
  },
  {
    title: "BOARD RES NO.",
    key: "boardResolutionNumber",
  },
  {
    title: "YEAR OFFERED",
    key: "yearOffered",
    value: v => h("span", { class: "text-no-wrap" }, helpers.formater.dateToWord(v.yearOffered)),
  },
  {
    title: "DATE APPROVED",
    key: "dateApproved",
    value: v => h("span", { class: "text-no-wrap" }, helpers.formater.dateToWord(v.dateApproved)),
  },
  {
    title: "EXAMINATION",
    key: "examination.examinationName",
  },
  {
    title: "INFO",
  },
  {
    title: "ACTION",
    key: "action",
  },
])

// 👉 Academic service
const acadService = new AcademicProgramService()

// 👉 Academic store
const acadStore = useAcademicProgramStore()

// 👉 Delivery unit
const selectedDeliveryUnit = inject("selectedDeliveryUnit", ref(null), false)

// 👉 search
const search = ref('')

// 👉 Default items per page
const itemsPerPage = ref(10)

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

// 👉 Data
const data = computed(() => {
  return acadStore.getAcademicPrograms
    .filter(ap => ap.academicProgramName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 On create event
async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On delete event
async function onDelete(academicProgram) {
  swal.value.fire({
    question: `Delete academic program "${ academicProgram.academicProgramName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await acadService.deleteAcademicProgram(academicProgram.id)

        if (code >= 200 && code <= 299)
        {
          toast.success("Academic Program successfully deleted.")
          acadStore.delete(academicProgram)
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 
    })
}

// 👉 On view event
async function onView(academicProgramRaw) {
  isModalVisible.value = true
  isUpdateMode.value = true
  acadStore.setField(academicProgramRaw.raw)
}

watch(selectedDeliveryUnit, async value => {
  if (!value) return

  acadStore.setDeliveryUnit(value)
  acadStore.clear()

  loaded.value = false

  try {
    const { status: code, data: response } = await acadService.getAcademicProgramsByDeliveryUniId(value)

    if (code == 200)
    {
      acadStore.setAcademicPrograms(response)
      loaded.value = true

      console.log(response)
    }
    else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
}, { deep: true, immediate: true })

// 
</script>


<template>
  <div>
    <div class="mb-4">
      <VRow>
        <VCol
          cols="8"
          md="4"
        >
          <VTextField
            v-model="search"
            label="Search program"
          />
        </VCol>
        <VCol
          cols="4"
          md="auto"
        >
          <ItemsPerPage
            v-model="itemsPerPage"
            style="width: auto !important; max-width: 5em !important;"
            :dense="!!false"
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
              icon="tabler-stack-2"
            />
            CREATE PROGRAM
          </VBtn>
        </VCol>
      </VRow>  
    </div>
    <VCard
      rounded="0"
      flat
      border
      style="border-top: none !important;"
    >
      <AppTable
        :headers="tableHeaders"
        :items="data"
        :items-per-page="itemsPerPage"
        @click:row="onView"
      >
        <template #item.action="{ item }">
          <VBtn
            variant="text"
            icon=""
            color="error"
            size="small"
            @click.stop="onDelete(item.raw)"
          >
            <VTooltip activator="parent">
              Delete academic program
            </VTooltip>

            <VIcon icon="tabler-trash" />
          </VBtn>
        </template>
      </AppTable>
    </VCard>  
  </div>
  
  <!-- Academic program create/update -->
  <Teleport to="#app">
    <AcademicProgramModal
      v-model="isModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </Teleport>
</template>
