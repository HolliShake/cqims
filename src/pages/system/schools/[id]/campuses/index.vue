<script setup>
import { helpers } from "@/helpers"
import CampusService from "@/services/campus.service"
import useCampusStore from "@/stores/campus.store"
import CampusModal from "@/views/pages/system/campus/Campus-Modal.vue"
import { avatarText } from "@core/utils/formatters"
import { inject, onMounted } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

// 👉 Router
const router = useRouter()

// 👉 Page data
const computedPageData = computed(() => { 
  try {
    return JSON.parse(localStorage.getItem("selectedSchool"))
  } catch (err) {
    return null
  }
})

// 👉 Breadcrumbs
const breadCrumbs = computed(() => {

  const schoolName = computedPageData.value ? computedPageData.value.schoolShortName : "School"

  return [
    {
      text: "Dashboard",
      disabled: false,
      href: "/dashboard",
    },

    // {
    //   text: "School",
    //   disabled: false,
    //   href: "/system/school",
    // },
    {
      text: schoolName,
      disabled: false,
      href: "#",
    },
    {
      text: "Campuses",
      disabled: true,
      href: "#",
    },
  ]
})

// 👉 Services
const campusService = new CampusService()

// 👉 Store
const campusStore = useCampusStore()

// 👉 Headers
const headers = ref([
  {
    title: "CAMPUS NAME",
    key: "campusName",
  },
  {
    title: "LOCATION",
    key: "location",
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

// Actual data
const data = computed(() => { 
  return campusStore.getCampuses
    .filter(d => d.campusName.toLowerCase().includes(search.value.toLowerCase()))
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Campus modal visibility
const isCampusModalVisible = ref(false)

// 👉 Is update mode
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 On create
async function onCreate() {
  isCampusModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On update
async function onUpdate(campusData) {
  isCampusModalVisible.value = true
  isUpdateMode.value = true
  campusStore.setField(campusData.raw)
}

// 👉 On delete
async function onDelete(campus) {
  swal.value.fire({
    question: `Delete campus "${ campus.campusName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const response = await campusService.deleteCampus(campus.id)

        if (response.status >= 200 && response.status <= 299)
        {
          await onSuccessDelete(campus)
        } else 
        {
          toast.error(response.message)
        }
      } catch (err) {
        toast.error(err.message)
      } 
    })
}

// 👉 On success delete
async function onSuccessDelete(campus) {
  await campusStore.removeCampus(campus)
  toast.success("Campus deleted successfully!")
}

onMounted(async () => {
  const ID = helpers.security.decrypt(props.id)
   
  if (!computedPageData.value)
  {
    return router.push("/notfound")
  }

  if (ID != computedPageData.value.id)
  {
    return router.push("/notfound")
  }

  campusStore.setSchool(ID)

  try {
    const { status: code, data: response, message: error } = await campusService.getSchoolCampuses(ID)

    if (code == 200)
    {
      campusStore.initialize(response)
      loaded.value = true
    } else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
  }
})

// 👉 Handle link
async function handleLink(campus) {
  localStorage.setItem("selectedCampus", JSON.stringify(campus))
}

//
</script>


<template>
  <section>
    <PageHeader
      :title="computedPageData?.schoolName ?? 'School'"
      subtitle="Shows all campuses of the school."
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
              label="Search"
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
            class="ms-0 ms-md-auto"
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
      <!-- 👉 Table -->
      <AppTable
        :headers="headers"
        :items="data"
        :loading="!loaded"
        @click:row="onUpdate"
      >
        <!-- 👉 Location -->
        <template #item.campusName="{ item }">
          <div class="demo-space-x flex-row flex-nowrap align-center">
            <VAvatar
              variant="tonal"
              color="primary"
              rounded="circle"
            >
              <span class="text-xs">{{ avatarText(item.raw.campusName) }}</span>
            </VAvatar>
            <span class="font-weight-bold text-no-wrap">{{ item.raw.campusName }} ({{ item.raw.campusShortName }})</span>
          </div>
        </template>
        <!-- 👉 Location -->
        <template #item.location="{ item }">
          <div class="demo-space-x flex-nowrap flex-row align-center">
            <VIcon
              start
              icon="mdi-map-marker"
              size="19"
              dd
              color="error"
            />
            <span class="text-no-wrap">{{ item.raw.barangay }} {{ item.raw.city }} {{ item.raw.province }}, {{ item.raw.country }}</span>
          </div>
        </template>
        <!-- 👉 Acton -->
        <template #item.action="{ item }">
          <RouterLink
            :to="{
              name: 'system-schools-id-campuses-campusid-buildings',
              params: {
                id: props.id,
                campusid: helpers.security.encrypt(item.raw.id)
              },
              props: true
            }"
          >
            <VBtn 
              icon="tabler-building" 
              variant="text"
              size="small"
              @click.stop="handleLink(item.raw)"
            >
              <VIcon
                icon="tabler-building"
                color="primary"
              />
              <VTooltip activator="parent">
                View Buildings
              </VTooltip>
            </VBtn>
          </RouterLink>

          <VBtn 
            icon="tabler-trash" 
            variant="text"
            size="small"
            color="error"
            @click.stop="onDelete(item.raw)"
          >
            <VIcon
              icon="tabler-trash"
              color="error"
            />
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <!-- 👉 CampusModal -->
    <Teleport to="#app">
      <CampusModal
        v-model="isCampusModalVisible"
        :is-update-mode="isUpdateMode"
      />
    </Teleport>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-schools
</route>
