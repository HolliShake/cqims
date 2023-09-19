<script setup>
import { helpers } from "@/helpers"
import DeliveryUnitService from "@/services/delivery-units.service"
import useDeliveryUnitStore from "@/stores/delivery-unit.store"
import DeliveryUnitModal from "@/views/pages/system/delivery-unit/DeliveryUnit-Modal.vue"
import DeliveryUnitView from "@/views/pages/system/delivery-unit/DeliveryUnitView.vue"
import { inject, provide } from "vue"
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

// 👉 Delivery Unit service
const duService = new DeliveryUnitService()

// 👉 Building store
const duStore = useDeliveryUnitStore()

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
      text: "Delivery Units",
      disabled: true,
      href: "#",
    },
  ]
})

// 👉 Search
const search = ref("")

// 👉 Current tab
const currentTab = ref(null)

// 👉 Data
const data = computed(() => {
  return duStore.getDeliveryUnits
    .filter(du => du.deliveryUnitShortName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Handle success create
const isDeliveryUnitModalVisible = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 On create
async function onCreate() {
  isDeliveryUnitModalVisible.value = true
}

// 👉 Pass to child
provide("selectedDeliveryUnit", currentTab)

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

  duStore.setCampus(ID)

  try {
    const { status: code, data: response, message: error } = await duService.getDeliveryUnitsByCampusId(ID)
    if (code == 200)
    {
      duStore.setDeliveryUnits(response)
      loaded.value = true

      if (response.length > 0)
      {
        currentTab.value = response[0].id
      }
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
                    icon="tabler-location-plus"
                  />
                  CREATE
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <!--  -->
      <VCol cols="12">
        <VSkeletonLoader
          v-if="!loaded"
          :loading="!loaded"
          type="image"
        />
        <template v-else>
          <VCard v-if="data.length <= 0">
            <VCardText class="text-center">
              No data available.
            </VCardText>
          </VCard>
          <VCard v-else>
            <VCardText>
              <VRow>
                <VCol cols="12">
                  <VTabs
                    v-model="currentTab"
                    class="v-tabs-pill"
                    selected-class="v-btn v-slide-group-item--active v-tab--selected v-theme--light text-success v-btn--density-default v-btn--size-default v-btn--variant-text v-tab"
                  >
                    <VTab
                      v-for="(du, index) in data"
                      :key="`du-item-${index}`"
                      :value="du.id"
                      class="text-truncate"
                    >
                      {{ du.deliveryUnitShortName }}
                    </VTab>
                  </VTabs>
                </VCol>
                <VCol cols="12">
                  <VWindow>
                    <VWindowItem>
                      <DeliveryUnitView />
                    </VWindowItem>
                  </VWindow>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </template>
      </VCol>
    </VRow>

    <!-- 👉 Building modal -->
    <Teleport to="#app">
      <DeliveryUnitModal v-model="isDeliveryUnitModalVisible" />
    </Teleport>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-schools
</route>
