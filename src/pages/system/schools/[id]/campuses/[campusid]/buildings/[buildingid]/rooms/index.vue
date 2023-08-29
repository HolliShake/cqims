<script setup>
import { helpers } from "@/helpers"
import RoomService from "@/services/room.service"
import useRoomStore from "@/stores/room.store"
import RoomModal from "@/views/pages/system/room/Room-Modal.vue"

const props = defineProps({
  buildingid: {
    type: String,
    required: true,
  },
})

// 👉 Service
const roomService = new RoomService()

// 👉 Store
const roomStore = useRoomStore()

// 👉 Page data
const computedPageData = computed(() => { 
  try {
    return JSON.parse(localStorage.getItem("selectedBuilding"))
  } catch (err) {
    return null
  }
})

// 👉 Breadcrumbs
const breadCrumbs = computed(() => {
  const buildingName = computedPageData.value ? computedPageData.value.buildingName : "Building"

  return [
    {
      text: "Dashboard",
      disabled: false,
      href: "/dashboard",
    },
    {
      text: buildingName,
      disabled: false,
      href: "#",
    },
    {
      text: "Rooms",
      disabled: true,
      href: "#",
    },
  ]
})

const data = computed(() => {
  return []
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Modal visibility
const isRoomModalVisible = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 On create
async function onCreate() {
  isRoomModalVisible.value = true
}

onMounted(async () => { 
  const ID = helpers.security.decrypt(props.buildingid)

  if (!computedPageData.value)
  {
    router.push("/notfound")
  }

  if (ID != computedPageData.value.id)
  {
    router.push("/notfound")
  }
  
  try {
    const response = await roomService.getAllRoomsByBuildingId(ID)

    if (response.status === 200)
    {
      roomStore.setRooms(response.data)
      loaded.value = true
    } else 
    {
      toast.error(response.message)
    }
  } catch (err) {
    console.log(err)
    toast.error(err.message)
  }
})
</script>

<template>
  <section>
    <PageHeader
      :title="computedPageData?.buildingName ?? 'Building'"
      subtitle="Shows all rooms in the building."
      :breadcrumb="breadCrumbs"
    />
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-3">
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField label="Search" />  
              </VCol>  
              <VCol
                class="ms-auto"
                cols="12"
                md="auto"
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
      <VCol cols="12">
        <VSkeletonLoader
          v-if="!loaded"
          type="list-item@3"
        />
        <template v-else>
          <VCard v-if="data.length <= 0">
            <VCardText class="text-center">
              No data found.
            </VCardText>  
          </VCard>
        </template>
      </VCol>
    </VRow>

    <Teleport to="#app">
      <RoomModal
        v-model="isRoomModalVisible"
        :building-id="computedPageData.id ?? null"
      />
    </Teleport>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-schools
</route>
