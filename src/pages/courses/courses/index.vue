<script setup>
import CourseService from "@/services/course.service"
import useCourseRequisiteStore from "@/stores/course-requisite.store"
import useCourseStore from "@/stores/course.store"
import CourseRequisiteModal from "@/views/pages/course/course-requisite/CourseRequisiteModal.vue"
import CourseModal from "@/views/pages/course/courses/CourseModal.vue"
import { computed, inject } from "vue"

// 👉 Service
const courseService = new CourseService()

// 👉 Store
const courseStore = useCourseStore()
const courseRequisiteStore = useCourseRequisiteStore()

const tableHeaders = ref([
  {
    title: '#',
    key: 'data-table-expand',
    align: "center",
  },
  {
    title: "COURSE NAME",
    key: "courseName",
    value: v => h("span", { class: "text-no-wrap" }, v.courseName),
  },
  {
    title: "CODE",
    key: "courseCode",
  },

  // {
  //   title: "SUBDISCIPLINE",
  //   key: "subDiscipline.subDisciplineCode",
  // },
  
  {
    title: "UNIT (LAB)",
    key: "unitsLab",
    align: "center",
  },
  {
    title: "UNIT (LEC)",
    key: "unitsLec",
    align: "center",
  },
  {
    title: "CREDIT HOURS (LAB)",
    key: "creditHoursLab",
  },
  {
    title: "CREDIT HOURS (LEC)",
    key: "creditHoursLec",
  },
  {
    title: "CREDIT HOURS",
    key: "creditHours",
  },
  {
    
    title: "CREDIT UNITS",
    key: "creditsUnit",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
  },
])

// 👉 Table headers
const requisiteHeaders = ref([
  {
    title: "COURSE NAME",
    key: "courseName",
    width: "auto",
    value: v => h("span", { class: "text-no-wrap" }, v.courseName),
  },
  {
    title: "CODE",
    key: "courseCode",
    width: "100%",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
    width: 100,
  },
])

// 👉 Modal visiblity
const isCourseModalVisible = ref(false)

// 👉 Is update mode
const isUpdateMode = ref(false)

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 Actual data
const data = computed(() => {
  return courseStore.getCourses
})

// 👉 On create event
async function onCreate()
{
  isCourseModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On view event
async function onView(courseRaw)
{
  isCourseModalVisible.value = true
  isUpdateMode.value = true
  courseStore.setField(courseRaw.raw)
}

// 👉 On delete event
async function onDelete(course)
{
  swal.value.fire({
    question: `Delete course "${ course.courseName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, message: error } = await courseService.deleteCourse(course.id)

        if (code >= 200 && code <= 299)
        {
          courseStore.delete(course)
          toast.success("Successfully delete course.")
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 
    })
}

// 👉 On Delete Requisite event
async function onDeleteRequisite(courseRequisite)
{
  swal.value.fire({
    question: `Delete course requisite "${ courseRequisite.requisite.courseName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, message: error } = await courseService.deleteCourse(course.id)

        if (code >= 200 && code <= 299)
        {
          courseRequisite.delete(courseRequisite)
          toast.success("Successfully delete course requisite.")
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
    const { status: code, data: response } = await courseService.getAllCourses()

    if (code == 200)
    {
      courseStore.initialize(response)
      loaded.value = true

      console.log(response)
    }
    else
    {
      toast.error(error)
    }
  } catch (err) {
    console.log(err)
    toast.error(err.response?.data ?? err.message)
  }
})
</script>

<template>
  <section>
    <PageHeader
      title="Courses"
      subtitle="Shows available courses"
    />

    <VCard>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="3"
          >
            <VTextField label="Search course" />
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
      <AppTable
        :headers="tableHeaders"
        :items="data"
        :loading="!loaded"
        expand-on-click
      >
        <!-- Expanded Row Data -->
        <template #expanded-row="slotProps">
          <tr class="v-data-table__tr">
            <td :colspan="tableHeaders.length">
              <VCardText class="pa-3">
                <VRow>
                  <VCol
                    cols="auto"
                    sm="12"
                  >
                    <div class="d-flex flex-column flex-md-row align-start align-md-center gap-2">
                      <VChip
                        variant="tonal"
                        color="success"
                        rounded="sm"
                        size="default"
                      >
                        <span class="font-weight-bold">#COURSE REQUISITE{{ (courseRequisiteStore.mapRequisites(slotProps.item.raw.courseRequisites).length > 1) ? "(S)" : "" }}</span>  
                      </VChip>

                      <CourseRequisiteModal @activate="courseRequisiteStore.setCourse(slotProps.item.raw.id)" />
                    </div>
                  </VCol>
                  <VCol cols="12">
                    <VCard style=" border: 0.5px solid rgb(var(--v-theme-surface)); background-color: rgb(var(--v-theme-background));">
                      <VCardText class="pa-3 text-center">
                        <div
                          v-if="courseRequisiteStore.mapRequisites(slotProps.item.raw.courseRequisites).length > 0"
                          class="d-flex flex-row flex-wrap gap-1"
                        >
                          <span
                            v-for="(item, index) in courseRequisiteStore.mapRequisites(slotProps.item.raw.courseRequisites)"
                            :key="`item-${index}`"
                          >
                            <VChip
                              pill
                              color=""
                              size="default"
                              @click.stop="onView({ raw: item.requisite })"
                            >

                              <VTooltip activator="parent">
                                {{ item.requisiteType }}
                              </VTooltip>

                              <span class="d-block text-sm me-2">{{ item.requisite.courseName }}</span>
                              <VBtn
                                variant="text"
                                color="error"
                                icon=""
                                size="small"
                                density="compact"
                                @click.stop="onDeleteRequisite(item)"
                              >
                                <VIcon icon="tabler-x" />
                              </VBtn>
                            </VChip>
                          </span>
                        </div>
                        <span
                          v-else
                          class="d-block text-center"
                        >
                          No Course Requisite.  
                        </span>
                      </VCardText>
                    </VCard>
                  </VCol>
                </VRow>
              </VCardText>
            </td>
          </tr>
        </template>
        
        <template #item.action="{ item }">
          <span class="text-no-wrap">
            <VBtn
              icon=""
              variant="text"
              color="primary"
              size="small"
              @click.stop="onView(item)"
            >
              <VTooltip activator="parent">
                View course
              </VTooltip>
              <VIcon icon="tabler-message" />
            </VBtn>  
          
            <VBtn
              icon=""
              variant="text"
              color="error"
              size="small"
              @click.stop="onDelete(item.raw)"
            >
              <VTooltip activator="parent">
                Delete course
              </VTooltip>
              <VIcon icon="tabler-trash" />
            </VBtn>    
          </span>
        </template>
      </AppTable>
    </VCard>

    <!-- To app -->
    <CourseModal
      v-model="isCourseModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </section>
</template>
