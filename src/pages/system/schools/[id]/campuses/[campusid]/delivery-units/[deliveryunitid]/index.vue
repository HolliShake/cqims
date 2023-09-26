<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { helpers } from '@/helpers'
import AcademicTermService from '@/services/academic-term.service'
import CurriculumService from '@/services/curriculum.service'
import useCurriculumStore from '@/stores/curriculum.store'
import CurriculumModal from "@/views/pages/system/curriculum/CurriculumModal.vue"
import { computedAsync } from '@vueuse/core'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  deliveryunitid: {
    type: String,
    required: true,
  },
})

// 👉 Router
const router = useRouter()

// 👉 Service
const curriculumService = new CurriculumService()

// 👉 Curriculum store
const curriculumStore = useCurriculumStore()

// 👉 Page data
const computedPageData = computed(() => { 
  try {
    return JSON.parse(localStorage.getItem("selectedAcademicProgram"))
  } catch (err) {
    return null
  }
})

// 👉 Breadcrumbs
const breadCrumbs = computed(() => {

  const academicProgram = computedPageData.value ? computedPageData.value.academicProgramShortName : "Academic Program"

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
      text: academicProgram,
      disabled: false,
      href: "#",
    },
    {
      text: "Curriculums",
      disabled: true,
      href: "#",
    },
  ]
})

// 👉 Table headers
const tableHeaders = ref([
  {
    title: '#',
    key: 'data-table-expand',
    width: 60,
  },
  {
    title: "CURRICULUMN NAME",
    key: "curriculumName",
    value: v => h("span", { class: "font-weight-bold text-sm text-no-wrap text-uppercase" }, v.curriculumName),
  },
  {
    title: "STATUS",
    key: "status",
    width: "200",
    align: "center",
  },
])

// 👉 Selected academic term
const academicTerm = ref(null)

// 👉 Selected status
const status = ref(-1)

// 👉 Campus modal visibility
const isCampusModalVisible = ref(false)

// 👉 Update mode flag
const isUpdateMode = ref(false)

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 Academic term items
const academicTermItems = computedAsync(async () => {
  try {
    const { status: code, data: response } = await (new AcademicTermService()).getAllAcademicTerm()

    if (code == 200)
    {
      return response
        .map(at => ({
          title: at.academicTermName,
          value: at.id,
        }))
    }
  } catch(err) {}

  return []
})

// 👉 Computed curriculum name
const computedCurriculumName = computed(() => {
  const dateNow = new Date(Date.now())
  
  return (computedPageData.value?.academicProgramShortName ?? "[PROGRAM]") + "_CURRICULUM_SY_" + `${dateNow.getFullYear()}-${dateNow.getFullYear() + 1}`
})

// 👉 Availabel academic term
const availableAcademicTerm = computedAsync(async () => {
  return [
    {
      title: "All",
      value: -1,
    },
    ...(await academicTermItems.value),
  ]
})

// 👉 Available items
const availableStatus = ref([
  {
    title: "All",
    value: -1,
  },
  {
    title: "Active",
    value: true,
  },
  {
    title: "Inactive",
    value: false,
  },
])

// 👉 Actual data
const data = computed(() => {
  return curriculumStore.getCurriculums
    .filter(c => true)
})

// 👉 On create event
async function onCreate()
{
  const data = /**/ 
    curriculumStore.getCurriculumModel

  data.curriculumName = computedCurriculumName.value

  isCampusModalVisible.value = true
  curriculumStore.setField(data)
}

// 👉 On update event
async function onUpdate(curriculumRaw)
{
  isCampusModalVisible.value = true
  isUpdateMode.value = true
  curriculumStore.setField(curriculumRaw)
}

// 👉 On delete event
async function onDelete(curriculumRaw)
{
  swal.value.fire({
    question: `Delete curriculum "${ curriculumRaw.curriculumName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, message: error } = await curriculumService.deleteCurriculum(curriculumRaw.id)

        if (code >= 200 && code <= 299)
        {
          curriculumStore.delete(curriculumRaw)
          toast.success("Successfully delete curriculum.")
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
  const academicProgramId = computedPageData.value?.id ?? null
  const ID = helpers.security.decrypt(props.deliveryunitid)

  if (ID == "" || !(academicProgramId))
  {
    return router.push("/notfound")
  }
  
  curriculumStore.setAcademicProgram(academicProgramId)
  curriculumStore.clear()

  try {
    const { status: code, data: response, message: error } = await curriculumService.getCurriculumsByAcademicProgramId(academicProgramId)

    if (code == 200)
    {
      curriculumStore.initialize(response)
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
</script>

<template>
  <section>
    <PageHeader
      :title="computedPageData?.academicProgramName ?? 'Academic Program'"
      subtitle="Shows all curriculums of the following program."
      :breadcrumb="breadCrumbs"
    />
    
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField label="Search curriculum" />  
              </VCol>  

              <VCol
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="academicTerm"
                  label="Filter by term"
                  :items="availableAcademicTerm"
                />  
              </VCol>

              <VCol
                cols="12"
                md="2"
              >
                <VSelect
                  v-model="status"
                  label="Filter by status"
                  :items="availableStatus"
                />  
              </VCol>

              <VCol
                cols="12"
                md="auto"
                class="ms-auto"
                order-md="last"
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
          
          <AppTable
            :headers="tableHeaders"
            :loading="!loaded"
            :items="data"
            expand-on-click
          >
            <!-- Name -->
            <template #item.curriculumName="{ item }">
              <div class="text-no-wrap">
                <VAvatar
                  variant="tonal"
                  color="primary"
                >
                  {{ avatarText(item.raw.curriculumName) }}  
                </VAvatar>
                <span class="ms-2 text-sm text-uppercase text-no-wrap font-weight-bold">{{ item.raw.curriculumName }}</span>  
              </div>
            </template>

            <!-- Status -->
            <template #item.status="{ item }">
              <VChip
                size="small"
                rounded="sm"
                :color="item.raw.isActive ? 'success' : 'error'"
              >
                <span class="text-xs"> {{ item.raw.isActive ? "&nbsp;ACTIVE&nbsp;" : "INACTIVE" }}</span>
              </VChip>
            </template>

            <!-- Expanded Row Data -->
            <template #expanded-row="slotProps">
              <tr>
                <td :colspan="tableHeaders.length">
                  <VCardText class="pa-3">
                    <VRow>
                      <VCol cols="12">
                        <div class="d-flex flex-row flex-nowrap align-center gap-2 gap-y-0">
                          <VBtn
                            icon=""
                            variant="tonal"
                            rounded="sm"
                            color="success"
                            size="small"
                          >
                            <VTooltip activator="parent">
                              View prospectus
                            </VTooltip>
                            <VIcon icon="tabler-book" />  
                          </VBtn>
                          <h3 class="font-weight-bold text-uppercase">
                            {{ slotProps.item.raw.curriculumName }}
                          </h3>

                          <VSpacer />

                          <VBtn
                            color="secondary"
                            size="small"
                            @click="onUpdate(slotProps.item.raw)"
                          >
                            <VIcon
                              start
                              icon="tabler-pencil"
                            />
                            EDIT  
                          </VBtn>

                          <VBtn
                            color="error"
                            size="small"
                            @click="onDelete(slotProps.item.raw)"
                          >
                            <VIcon
                              start
                              icon="tabler-trash"
                            />
                            DELETE
                          </VBtn>
                        </div>
                      </VCol>
                      <VCol
                        cols="12"
                        class="py-0"
                      >
                        <VDivider />  
                      </VCol>
                      <VCol cols="12">
                        <div class="d-flex flex-row flex-wrap text-wrap gap-1">
                          <VChip
                            class="text-nowrap m-0"
                            size="small"
                            rounded="sm"
                            color="success"
                          >
                            <span class="text-xs text-disabled">{{ slotProps.item.raw.programType }}</span>
                          </VChip>

                          <VChip
                            class="text-nowrap m-0"
                            size="small"
                            rounded="sm"
                            color="primary"
                          >
                            <span class="text-xs text-disabled">{{ slotProps.item.raw.academicProgram.academicProgramName }}</span>
                          </VChip>

                          <VChip
                            class="text-nowrap m-0"
                            size="small"
                            rounded="sm"
                            color="warning"
                          >
                            <span class="text-xs text-disabled">{{ slotProps.item.raw.academicTerm.academicTermName }}</span>
                          </VChip>  

                          <VChip
                            class="text-nowrap m-0"
                            size="small"
                            rounded="sm"
                            color="secondary"
                          >
                            <span class="text-xs text-disabled">{{ slotProps.item.raw.minor }}</span>
                          </VChip>  

                          <VChip
                            class="text-nowrap m-0"
                            size="small"
                            rounded="sm"
                            color="info"
                          >
                            <span class="text-xs text-disabled">{{ slotProps.item.raw.major }}</span>
                          </VChip>  

                          <VChip
                            class="text-nowrap m-0"
                            size="small"
                            rounded="sm"
                            color="#ffff00"
                          >
                            <span class="text-xs text-disabled">passing: {{ slotProps.item.raw.minScore }}</span>
                          </VChip>  
                        </div>
                        <div class="d-block mt-2">
                          <div class="demo-space-x">
                            <span class="text-sm text-disabled text-no-wrap">
                              <VIcon
                                :icon="slotProps.item.raw.isActive ? 'mdi-check-circle': 'mdi-close-circle'"
                                size="12"
                                :color="slotProps.item.raw.isActive ? 'success':'error'"
                              />
                              is active
                            </span>

                            <span class="text-sm text-disabled text-no-wrap">
                              <VIcon
                                :icon="slotProps.item.raw.isDefault ? 'mdi-check-circle': 'mdi-close-circle'"
                                size="12"
                                :color="slotProps.item.raw.isDefault ? 'success':'error'"
                              />
                              is default
                            </span>  
                          </div>
                        </div>  
                      </VCol>
                    </VRow>  
                  </VCardText>
                </td>  
              </tr>
            </template>
          </AppTable>
        </VCard>  
      </VCol>  
    </VRow>

    <Teleport to="#app">
      <CurriculumModal
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
