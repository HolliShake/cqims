<script setup>
import BroadDisciplineService from "@/services/broad-discipline.service"
import useBroadDisciplineStore from "@/stores/broad-discipline.store"
import MajorDisciplineService from "@/services/major-discipline.service"
import useMajorDisciplineStore from "@/stores/major-discipline.store"
import SubDisciplineService from "@/services/sub-discipline.service"
import useSubDisciplineStore from "@/stores/sub-discipline.store"
import BroadDisciplineModal from "./BroadDisciplineModal.vue"
import MajorDisciplineModal from "./MajorDisciplineModal.vue"
import SubDisciplineModal from "./SubDisciplineModal.vue"

// 👉 Broad
const broadDisciplineService = new BroadDisciplineService()
const broadDisciplineStore = useBroadDisciplineStore()

// 👉 Major
const majorDisciplineService = new MajorDisciplineService()
const majorDisciplineStore = useMajorDisciplineStore()

// 👉 Sub
const subDisciplineService = new SubDisciplineService()
const subDisciplineStore = useSubDisciplineStore()

// 👉 Table headers
const tableHeaders = reactive({
  BROAD: [
    {
      title: "CODE",
      key: "broadDisciplineCode",
    },
    {
      title: "DESCRIPTION",
      key: "broadDisciplineDescription",
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: 100,
    },
  ],
  MAJOR: [
    {
      title: "CODE",
      key: "majorDisciplineCode",
    },
    {
      title: "DESCRIPTION",
      key: "majorDisciplineDescription",
    },
    {
      title: "BROAD DISCIPLINE",
      key: "broadDiscipline.broadDisciplineCode",
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: 100,
    },
  ],
  SUB: [
    {
      title: "CODE",
      key: "subDisciplineCode",
    },
    {
      title: "DESCRIPTION",
      key: "subDisciplineDescription",
    },
    {
      title: "MAJOR DISCIPLINE",
      key: "majorDiscipline.majorDisciplineCode",
    },
    {
      title: "ACTION",
      key: "action",
      align: "center",
      width: 100,
    },
  ],
})

// 👉 Current tab
const currentTab = ref("broad")

// 👉 Discipline modal states
const modalStates = reactive({
  broadModalVisible: ref(false),
  majorModalVisible: ref(false),
  subModalVisible: ref(false),
})

const searchState = reactive({
  broadSearch: ref(""),
  majorSearch: ref(""),
  subSearch: ref(""),
})

// 👉 Is update mode
const isUpdateMode = ref(false)

// 👉 Actual broad data
const broadData = computed(() => {
  return broadDisciplineStore.getBroadDisciplines
    .filter(bd => bd.broadDisciplineCode.toLowerCase().startsWith(searchState.broadSearch.toLowerCase()))
})

// 👉 Actual major data
const majorData = computed(() => {
  return majorDisciplineStore.getMajorDisciplines
    .filter(md => md.majorDisciplineCode.toLowerCase().startsWith(searchState.majorSearch.toLowerCase()))
})

// 👉 Actual sub data
const subData = computed(() => {
  return subDisciplineStore.getSubDisciplines
    .filter(sd => sd.subDisciplineCode.toLowerCase().startsWith(searchState.subSearch.toLowerCase()))
})


// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 On create event
async function onCreate()
{  
  switch (currentTab.value.toLowerCase()) 
  {
  case "broad":
    modalStates.broadModalVisible = true
    break
  case "major":
    modalStates.majorModalVisible = true
    break
  case "sub":
    modalStates.subModalVisible = true
    break
  }
  isUpdateMode.value = false
}

// 👉 On view event
async function onView(disciplineRaw)
{
  switch (currentTab.value.toLowerCase()) 
  {
  case "broad":
    modalStates.broadModalVisible = true
    broadDisciplineStore.setField(disciplineRaw.raw)
    break
  case "major":
    modalStates.majorModalVisible = true
    majorDisciplineStore.setField(disciplineRaw.raw)
    break
  case "sub":
    modalStates.subModalVisible = true
    subDisciplineStore.setField(disciplineRaw.raw)
    break
  }
  isUpdateMode.value = true
}

// 👉 On Delete event
async function onDelete(discipline, name)
{
  let serviceCallback = x => null
  let storeCallBack = x => null

  switch (currentTab.value.toLowerCase()) 
  {
  case "broad":
    serviceCallback = (broadDisciplineService.deleteBroadDiscipline).bind(broadDisciplineService)
    storeCallBack = broadDisciplineStore.delete
    break
  case "major":
    serviceCallback = (majorDisciplineService.deleteMajorDiscipline).bind(majorDisciplineService)
    storeCallBack = majorDisciplineStore.delete
    break
  case "sub":
    serviceCallback = (subDisciplineService.deleteSubDiscipline).bind(subDisciplineService)
    storeCallBack = subDisciplineStore.delete
    break
  }

  swal.value.fire({
    question: `Delete discipline "${ name }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, message: error } = await serviceCallback(discipline.id)

        if (code >= 200 && code <= 299)
        {
          storeCallBack(discipline)
          toast.success("Successfully deleted discipline.")
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 
    })
}

onMounted(async () => {
  try {
    const { status: code0, data: response0, message: error0 } = await broadDisciplineService.getAllBroadDiscipline()

    if (code0 == 200)
    {
      broadDisciplineStore.initialize(response0)
    }
    else 
    {
      toast.error(error0)
    }

    const { status: code1, data: response1, message: error1 } = await majorDisciplineService.getAllMajorDiscipline()

    if (code1 == 200)
    {
      majorDisciplineStore.initialize(response1)
    }
    else 
    {
      toast.error(error1)
    }

    const { status: code2, data: response2, message: error2 } = await subDisciplineService.getAllSubDiscipline()

    if (code2 == 200)
    {
      subDisciplineStore.initialize(response2)
    }
    else 
    {
      toast.error(error2)
    }

    loaded.value = true
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
        <VCol cols="12">
          <VTabs
            v-model="currentTab"
            class="v-tabs-pill"
          >
            <VTab value="broad">
              BROAD
            </VTab>
            <VTab value="major">
              MAJOR
            </VTab>
            <VTab value="sub">
              SUB
            </VTab>
          </VTabs>
        </VCol>
        <VCol cols="12">
          <VWindow v-model="currentTab">
            <VWindowItem value="broad">
              <VCard
                flat
                border
              >
                <VCardText class="pa-3">
                  <VRow>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <VTextField
                        v-model="searchState.broadSearch"
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
                        CREATE ENTRY  
                      </VBtn>  
                    </VCol>  
                  </VRow>
                </VCardText>
                <AppTable
                  :headers="tableHeaders.BROAD"
                  :items="broadData"
                  :loading="!loaded"
                  @click:row="onView"
                >
                  <template #item.action="{ item }">
                    <VBtn
                      variant="text"
                      icon=""
                      size="small"
                      color="error"
                      @click.stop="onDelete(item.raw, item.raw.broadDisciplineCode)"
                    >
                      <VTooltip activator="parent">
                        Delete discipline
                      </VTooltip>
                      <VIcon icon="tabler-trash" />
                    </VBtn>
                  </template>
                </AppTable>  
              </VCard>
            </VWindowItem>
            <VWindowItem value="major">
              <VCard
                flat
                border
              >
                <VCardText class="pa-3">
                  <VRow>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <VTextField
                        v-model="searchState.majorSearch"
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
                        CREATE ENTRY  
                      </VBtn>  
                    </VCol>  
                  </VRow>
                </VCardText>
                <AppTable
                  :headers="tableHeaders.MAJOR"
                  :items="majorData"
                  :loading="!loaded"
                  @click:row="onView"
                >
                  <template #item.action="{ item }">
                    <VBtn
                      variant="text"
                      icon=""
                      size="small"
                      color="error"
                      @click.stop="onDelete(item.raw, item.raw.majorDisciplineCode)"
                    >
                      <VTooltip activator="parent">
                        Delete discipline
                      </VTooltip>
                      <VIcon icon="tabler-trash" />
                    </VBtn>
                  </template>
                </AppTable>  
              </VCard>
            </VWindowItem>
            <VWindowItem value="sub">
              <VCard
                flat
                border
              >
                <VCardText class="pa-3">
                  <VRow>
                    <VCol
                      cols="12"
                      md="3"
                    >
                      <VTextField
                        v-model="searchState.subSearch"
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
                        CREATE ENTRY  
                      </VBtn>  
                    </VCol>  
                  </VRow>
                </VCardText>
                <AppTable
                  :headers="tableHeaders.SUB"
                  :items="subData"
                  :loading="!loaded"
                  @click:row="onView"
                >
                  <template #item.action="{ item }">
                    <VBtn
                      variant="text"
                      icon=""
                      size="small"
                      color="error"
                      @click.stop="onDelete(item.raw, item.raw.subDisciplineCode)"
                    >
                      <VTooltip activator="parent">
                        Delete discipline
                      </VTooltip>
                      <VIcon icon="tabler-trash" />
                    </VBtn>
                  </template>
                </AppTable>  
              </VCard>
            </VWindowItem>
          </VWindow>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>

  <Teleport to="#app">
    <BroadDisciplineModal
      v-model="modalStates.broadModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </Teleport>
  <Teleport to="#app">
    <MajorDisciplineModal
      v-model="modalStates.majorModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </Teleport>
  <Teleport to="#app">
    <SubDisciplineModal
      v-model="modalStates.subModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </Teleport>
</template>
