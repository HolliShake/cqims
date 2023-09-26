<script setup>
import CourseService from "@/services/course.service"
import useCourseStore from "@/stores/course.store"
import CourseModal from "@/views/pages/course/courses/CourseModal.vue"
import { computed, inject } from "vue"

// 👉 Service
const courseService = new CourseService()

// 👉 Store
const courseStore = useCourseStore()

const tableHeaders = ref([
  {
    title: "COURSE NAME",
    key: "courseName",
  },
  {
    title: "CODE",
    key: "courseCode",
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
        @click:row="onView"
      >
        <template #item.action="{ item }">
          <VBtn
            icon=""
            variant="text"
            color="error"
            size="small"
            @click.stop=""
          >
            <VTooltip activator="parent">
              Delete course
            </VTooltip>
            <VIcon icon="tabler-trash" />
          </VBtn>  
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
