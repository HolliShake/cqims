<script setup>
import { helpers } from "@/helpers"
import RoomService from "@/services/room.service"
import useRoomStore from "@/stores/room.store"
import RoomModal from "@/views/pages/system/room/Room-Modal.vue"
import { inject } from "vue"

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

function groupByFloorNumber(data) {
  const FLOORS = Array.from(new Set(data.map(room => room.floorNumber))).sort()

  const group = []

  FLOORS.forEach(number => {
    group.push(data.filter(room => room.floorNumber == number))
  })

  return group
}

// 👉 Page data
const computedPageData = computed(() => { 
  try {
    return JSON.parse(localStorage.getItem("selectedBuilding"))
  } catch (err) {
    return null
  }
})

// 👉
const floorItems = computed(() => {
  const items = []

  if (!computedPageData.value) return items

  for(let i = 1;i <= computedPageData.value.numberOfFloors;i++) items.push(i)
  
  return items
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

// 👉 Search query
const searchRoom = ref('')

// 👉 Actual data
const data = computed(() => {
  const items = roomStore.getRooms
    .filter(room => room.roomName.toLowerCase().startsWith(searchRoom.value.toLowerCase()))

  return groupByFloorNumber(items)
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Modal visibility
const isRoomModalVisible = ref(false)

// 👉 Is update mode
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 On create
async function onCreate() {
  isRoomModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On delete
async function onDelete(room) {
  swal.value.fire({
    question: `Delete room "${ room.roomName}"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await roomService.deleteRoom(room.id)

        if (code >= 200 && code <= 299)
        {
          roomStore.removeRoom(room)
          toast.success("Successfully deleted room.")
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
async function onView(room) {
  isRoomModalVisible.value = true
  isUpdateMode.value = true
  roomStore.setRoomModel(room)
}

onMounted(async () => { 
  const ID = helpers.security.decrypt(props.buildingid)

  if (!computedPageData.value)
  {
    return router.push("/notfound")
  }

  if (ID != computedPageData.value.id)
  {
    return router.push("/notfound")
  }
  
  try {
    const { status: code, data: response,  message: error } = await roomService.getAllRoomsByBuildingId(ID)

    if (code == 200)
    {
      console.log(response)
      roomStore.setRooms(response)
      loaded.value = true
    } else 
    {
      toast.error(error)
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.message)
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
                <VTextField
                  v-model="searchRoom"
                  label="Search"
                />  
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
      <VCol
        cols="12"
        class="py-0"
      >
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
          <VExpansionPanels
            v-else
            mandatory
            :model-value="0"
          >
            <VExpansionPanel
              v-for="(rooms, index) in data"
              :key="`room-${index}`"
            >
              <VExpansionPanelTitle>
                <h3>FLOOR #{{ rooms[0].floorNumber }}</h3>  
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <VCard
                  flat
                  border
                  style="border-top: none !important;"
                >
                  <AppTable
                    :headers="[{ title: 'ROOM NAME', key: 'roomName' }, { title: 'SHORT NAME', key: 'roomShortName' }, { title: 'DESCRIPTION', key: 'roomDescription' }, { title: 'TYPE', key: 'type' }, { title: 'ACTION', key: 'action', align: 'center' }]"
                    :items="rooms"
                    @click:row="onView($event.raw)"
                  >
                    <!-- room name -->
                    <template #item.roomName="{ item }">
                      <div>
                        <span class="d-block font-weight-bold text-uppercase">{{ item.raw.roomName }}</span>
                        <span class="d-block text-xs text-disabled mt-n1">#{{ item.raw.roomNumber }}</span>
                      </div>
                    </template>
                    <!-- type -->
                    <template #item.type="{ item }">
                      <VChip
                        variant="tonal"
                        rounded="circular"
                        :color="(item.raw.isLaboratory) ?'primary' : 'success'"
                      >
                        <span class="text-xs">{{ (item.raw.isLaboratory) ? "&nbsp;&nbsp;LABORATORY&nbsp;&nbsp;&nbsp;" : "OTHER/LECTURE" }}</span>
                      </VChip>
                    </template>
                    <!-- action -->
                    <template #item.action="{ item }">
                      <VBtn
                        variant="text"
                        icon=""
                        color="error"
                        size="small"
                        rounded="circle"
                        @click.stop="onDelete(item.raw)"
                      >
                        <VTooltip activator="parent">
                          Delete Room
                        </VTooltip>  

                        <VIcon icon="tabler-trash" />
                      </VBtn>
                    </template>
                  </AppTable>
                </VCard>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </template>
      </VCol>
    </VRow>

    <Teleport to="#app">
      <RoomModal
        v-model="isRoomModalVisible"
        :is-update-mode="isUpdateMode"
        :floor-numbers="floorItems"
        :building-id="computedPageData.id ?? null"
      />
    </Teleport>
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-schools
</route>
