<script setup>
import { helpers } from "@/helpers"
import BuildingService from "@/services/building.service"
import useBuildingStore from "@/stores/building.store"
import BuildingCard from "@/views/pages/system/building/BuildingCard.vue"
import BuildingModal from "@/views/pages/system/building/BuildingModal.vue"
import { inject } from "vue"
import { useRouter } from "vue-router"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  campusid: {
    type: String,
    required: true,
  },
})

// 👉 Router
const router = useRouter()

// 👉 Building service
const buildingService = new BuildingService()

// 👉 Building store
const buildingStore = useBuildingStore()

// 👉 Page data
const computedPageData = computed(() => { 
  try {
    return JSON.parse(localStorage.getItem("selectedCampus"))
  } catch (err) {
    return null
  }
})

// 👉 Breadcrumbs
const breadCrumbs = computed(() => {

  const campusName = computedPageData.value ? computedPageData.value.campusShortName : "Campus"

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
      text: campusName,
      disabled: false,
      href: "#",
    },
    {
      text: "Buildings",
      disabled: true,
      href: "#",
    },
  ]
})

// 👉 Stand alone paginationMeta | extraccted from @fake-db/utils
const paginationMeta = computed(() => {
  return (options, total) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    let end = Math.min(options.page * options.itemsPerPage, total)
    
    end = end < 0 ? total : end

    return `Showing ${start} to ${end} of ${total} entries`
  }
})

//  👉 Default page meta
const options = ref({
  page: 1,
  itemsPerPage: 10,
})

// 👉 Search
const search = ref("")

// 👉 Data
const data = computed(() => {
  return buildingStore.getBuildings
    .sort((a, b) => a.buildingNumber - b.buildingNumber)
    .filter(d => d.buildingName.toLowerCase().includes(search.value.toLowerCase()))
})

// 👉 Table paged data
const pagedData = computed(() => {
  if (options.value.itemsPerPage == -1) return data.value

  // Slice per page
  return data.value
    .slice((options.value.page - 1) * options.value.itemsPerPage, options.value.page * options.value.itemsPerPage)
})

// 👉 Computed number of rows
const rows = computed(() => {
  if (options.value.itemsPerPage == -1) return 1

  return Math.ceil(data.value.length / options.value.itemsPerPage)
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Handle success create
const isBuildingModalVisible = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 On create
async function onCreate() {
  isBuildingModalVisible.value = true
}

// 👉 On update
async function onUpdate(buildingId) {
  const buildingData = data.value.find(d => d.id == buildingId)

  if (!buildingData) // Not found!
    return toast.error("Building not found.")

  buildingStore.setBuildingModel(buildingData, true)
  isBuildingModalVisible.value = true
}

// 👉 Success create
async function onSuccessCreate(building) {
  buildingStore.appendBuilding(building)
  toast.success("Building created successfully.")
}

// 👉 Success update
async function onSuccessUpdate(building) {
  buildingStore.patchBuilding(building)
  toast.success("Building updated successfully.")
}

// 👉 Success delete
async function onSuccessDelete(building) {
  buildingStore.removeBuilding(building)
  toast.success("Building deleted successfully.")
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

  try {
    const { status: code, data: response, message: error } = await buildingService.getAllBuildingsByCampusId(ID)

    if (code== 200)
    {
      buildingStore.setBuilding(response)
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
      :title="computedPageData?.campusName ?? 'Campus'"
      subtitle="Shows all available buildings of the school."
      :breadcrumb="breadCrumbs"
    />
    <VRow>
      <VCol cols="12">
        <VCard>
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
                  v-model="options.itemsPerPage"
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
        </VCard>
      </VCol>
      <VCol
        v-if="!loaded"
        cols="12"
      >
        <VSkeletonLoader type="table-row-divider@4" />
      </VCol>
      <template v-else>
        <VCol
          v-if="pagedData.length <= 0"
          cols="12"
        >
          <VCard>
            <VCardText class="text-center">
              No data available
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          v-for="(item, index) in pagedData"
          v-else
          :key="`card-${index}`"
          cols="*"
          sm="6"
          md="6"
          lg="4"
          xl="3"
        >
          <BuildingCard 
            :building-id="item.id" 
            :building-number="item.buildingNumber" 
            :building-name="item.buildingName" 
            :building-short-name="item.buildingShortName" 
            :building-description="item.buildingDescription" 
            @click:edit="onUpdate"
          />
        </VCol>
        <VCol cols="12">
          <div :class="`d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 ${props.shrink ? 'pa-0' : 'pa-5'} pt-3`">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta(options, data.length) }}
            </p>

            <VPagination
              v-model="options.page"
              :length="rows"
              :total-visible="$vuetify.display.xs ? 1 : 5"
              size="small"
            />
          </div>
        </VCol>
      </template>
    </VRow>

    <!-- 👉 Building modal -->
    <Teleport to="#app">
      <BuildingModal
        v-model="isBuildingModalVisible"
        :campus-id="computedPageData?.id ?? null"
        @success:create="onSuccessCreate"
        @success:update="onSuccessUpdate"
        @success:delete="onSuccessDelete"
      />
    </Teleport>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-schools
</route>
