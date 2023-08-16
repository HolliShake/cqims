<script setup>
import { helpers } from "@/helpers"
import CampusService from "@/services/campus.service"
import useCampusStore from "@/stores/campus.store"
import { avatarText } from "@core/utils/formatters"
import { inject, onMounted } from 'vue'
import { useRouter } from "vue-router"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

// 👉 Router
const router = useRouter()

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
    {
      text: "School",
      disabled: false,
      href: "/system/school",
    },
    {
      text: schoolName,
      disabled: true,
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

// 👉 Toast
const toast = inject("toast")

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

  try {
    const response = await campusService.getSchoolCampuses(ID)

    if (response.status >= 200 && response.status <= 299)
    {
      campusStore.setCampuses(response.data)
      loaded.value = true
    } else 
    {
      toast.error(response.message)
    }

  } catch (err) {
    toast.error(err.message)
  }
})

//
</script>


<template>
  <section>
    <PageHeader
      :title="computedPageData?.schoolShortName ?? 'School'"
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
            <VBtn block>
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
            <span class="font-weight-bold text-no-wrap">{{ item.raw.campusName }}</span>
          </div>
        </template>
        <!-- 👉 Location -->
        <template #item.location="{ item }">
          <VIcon
            start
            icon="mdi-map-marker"
            size="19"
            dd
            color="error"
          />
          <span>{{ item.raw.zipCode.barangay }} {{ item.raw.zipCode.city }} {{ item.raw.zipCode.province }}, {{ item.raw.zipCode.country }}</span>
        </template>
        <!-- 👉 Acton -->
        <template #item.action="{ item }">
          <RouterLink
            :to="{
              name: 'system-school-id-campuses-campusid-building',
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
        </template>
      </AppTable>
    </VCard>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-school
</route>
