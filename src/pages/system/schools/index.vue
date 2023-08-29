<script setup>
import SchoolService from "@/services/school.service"
import useSchoolStore from "@/stores/school.store"
import SchoolModal from "@/views/pages/system/school/SchoolModal.vue"
import { avatarText } from "@core/utils/formatters"
import { inject, onMounted } from "vue"

// 👉 Services
const schoolService = new SchoolService()

// 👉 Store
const schoolStore = useSchoolStore()

const breadCrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Schools",
    disabled: true,
    href: "#",
  },
])

// 👉 Headers
const headers = ref([
  {
    title: "SCHOOL ID",
    key: "schoolNumber",
  },
  {
    title: "SCHOOL NAME",
    key: "schoolName",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
  },
])

// 👉 Search
const search = ref("")

// 👉 Items per page
const itemsPerPage = ref(10)

// 👉 Data
const data = computed(() => { 
  return schoolStore.getSchools
    .filter(d => d.schoolNumber.toLowerCase().startsWith(search.value.toLowerCase()) || d.schoolName.toLowerCase().includes(search.value.toLowerCase()) || d.schoolShortName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const isSchoolModalShown = ref(false)

// 👉 Is update mode
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 Create School
async function onCreate() {
  isSchoolModalShown.value = true
  isUpdateMode.value = false
}

// 👉 Update School
async function onUpdate(schoolData) {
  isSchoolModalShown.value = true
  isUpdateMode.value = true
  schoolStore.setField(schoolData.raw)
}

// 👉 Delete School
async function onDelete(school) {
  swal.value.fire({
    question: `Delete school "${ school.schoolName}"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const response = await schoolService.deleteSchool(school.id)

        if (response.status >= 200 && response.status <= 299)
        {
          await onSuccessDelete(school)
        } else 
        {
          toast.error(response.message)
        }
      } catch (err) {
        toast.error(err.message)
      } 

    })
}

// 👉 On delete successfully
async function onSuccessDelete(school) {
  schoolStore.delete(school)
  toast.success("Successfully deleted school")
}

onMounted(async () => {
  try {
    const { status: code, data: response, message: error } = await schoolService.getAllSchool()
  
    if (code == 200)
    {
      schoolStore.initialize(response)
      loaded.value = true
    } else {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
})

//
</script>


<template>
  <section>
    <PageHeader
      title="Schools"
      subtitle="Shows registered schools"
      :breadcrumb="breadCrumbs"
    />

    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="8"
            md="4"
          >
            <VTextField
              v-model="search"
              label="Search school or number"
            />
          </VCol>
          <VCol
            cols="4"
            md="auto"
          >
            <ItemsPerPage
              v-model="itemsPerPage"
              style="width: 100% !important;"
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
                icon="tabler-plus"
              />
              CREATE
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <AppTable
        :headers="headers"
        :items="data"
        :loading="!loaded"
        :items-per-page="itemsPerPage"
        @click:row="onUpdate"
      >
        <template #item.schoolNumber="{ item }">
          <!-- 👉 School Number -->
          <VChip
            size="small"
            rounded="sm"
            variant="tonal"
            color="warning"
          >
            {{ item.raw.schoolNumber }}
          </VChip>
        </template>
        
        <template #item.schoolName="{ item }">
          <!-- 👉 School Name -->
          <div class="demo-space-x flex-nowrap">
            <VAvatar
              rounded="circle"
              variant="tonal"
              color="primary"
            >
              <span class="text-xs">{{ avatarText(item.raw.schoolName) }}</span>
            </VAvatar>
            <span class="font-weight-bold text-no-wrap">{{ item.raw.schoolName }}</span>
          </div>
        </template>

        <template #item.action="{ item }">
          <!-- 👉 Action -->
          <VBtn
            variant="text"
            color="error"
            rounded="circle"
            icon="tabler-trash"
            size="small"
            @click.stop="onDelete(item.raw)"
          />
        </template>
      </AppTable>
    </VCard>

    <!-- 👉 SchoolModal -->
    <Teleport to="#app">
      <SchoolModal
        v-model="isSchoolModalShown"
        :is-update-mode="isUpdateMode"
      />
    </Teleport>
  </section>
</template>
