<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import CourseRequisiteService from "@/services/course-requisite.service"
import useCourseRequisiteStore from "@/stores/course-requisite.store"
import useCourseStore from "@/stores/course.store"
import { inject, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  "activate",
])

const tableHeaders = ref([
  {
    title: "COURSE NAME",
    key: "courseName",
    width: "auto",
    value: v => h("span", { class: "text-no-wrap" }, v.courseName),
  },
  {
    title: "CODE",
    key: "courseCode",
  },
  {
    title: "SUBDISCIPLINE",
    key: "subDiscipline.subDisciplineCode",
    width: "100%",
  },
  {
    title: "MORE",
    key: "more",
    align: "center",
  },
])

// 👉 Services
const courseRequisiteService = new CourseRequisiteService()

// 👉 Store
const courseStore = useCourseStore()
const courseRequisiteStore = useCourseRequisiteStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Toast
const toast = inject('toast')

// 👉 Search
const search = ref("")

// 👉 Selected courses
const selectedCourses = ref([])

// 👉 Actual data
const data = computed(() => {
  return courseStore.getCourses
    .filter(c => c.id != courseRequisiteStore.getCourse)
    .filter(c => c.courseName.toLowerCase().startsWith(search.value.toLowerCase()))
})

// 👉 Watch props
watch(props, props => {
  visible.value = props.modelValue
}, { deep: true })

// 👉 Watch visible
watch(visible, visible => {
  emit('update:modelValue', visible)
})

// 👉 On activate event
async function onActivate()
{
  visible.value = true
  emit("activate", visible.value)
}

// 👉 On submit
async function onSubmit() 
{
  return await onCreate() 
}

// 👉 On create campus
async function onCreate() 
{

  const payload = selectedCourses.value.map(courseId => ({
    requisiteType: 0, // Default is Co
    parentCourseId: courseRequisiteStore.getCourse,
    requisiteId: courseId,
  }))

  console.log(payload)

  try {
    const { status: code, data: response, message: error } = await courseRequisiteService.createAllCourseRequisite(payload)

    if (code >= 200 && code <= 299)
    {
      courseRequisiteStore.addAll(response)
      toast.success("Course requisite successfully created.")

      visible.value = false
    }
    else
    {
      toast.error(error)
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 
</script>


<template>
  <AppDialog
    v-model="visible"
    class="v-dialog-xl"
  >
    <template #activator>
      <VBtn
        size="small"
        rounded="sm"
        @click="onActivate"
      >
        <VIcon
          start
          icon="tabler-plus"
        />
        ADD REQUISITE
      </VBtn>
    </template>

    <template #title>
      Select Course Requisite(s)
    </template>
    <template #content>
      <VCard
        border
        rounded="sm"
      >
        <VCardText class="pa-3">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="search"
                label="Search course"
              />
            </VCol>
          </VRow>
        </VCardText>
        <AppTable
          v-model="selectedCourses"
          :headers="tableHeaders"
          :items="data"
          expand-on-click
          show-select
        >
          <template #item.more="{ item }">
            <VMenu
              location="start"
              open-on-hover
              :max-width="260"
            >
              <template #activator="{ props }">
                <VBtn
                  variant="text"
                  density="compact"
                  v-bind="props"
                >
                  <span class="text-sm">INFO</span>
                </VBtn>
              </template>
              <VCard>
                <VCardText class="pa-3">
                  <VRow no-gutters>
                    <VCol cols="12">
                      <span class="d-flex flex-nowrap w-100 text-xs"><span>UNITS (LAB):</span> <VSpacer /> <span>{{ item.raw.unitsLab }}</span></span>
                    </VCol>
                    <VCol cols="12">
                      <span class="d-flex flex-nowrap w-100 text-xs"><span>UNITS (LEC):</span> <VSpacer /> <span>{{ item.raw.unitsLec }}</span></span>
                    </VCol>
                    <VCol cols="12">
                      <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED HOURS (LAB):</span> <VSpacer /> <span>{{ item.raw.creditHoursLab }}</span></span>
                    </VCol>
                    <VCol cols="12">
                      <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED HOURS (LEC):</span> <VSpacer /> <span>{{ item.raw.creditHoursLec }}</span></span>
                    </VCol>
                    <VCol cols="auto">
                      <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED HOURS:</span> <VSpacer /> <span>{{ item.raw.creditHours }}</span></span>
                    </VCol>
                    <VCol cols="auto">
                      <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED UNITS:</span> <VSpacer /> <span>{{ item.raw.creditsUnit }}</span></span>
                    </VCol>
                    <VCol cols="12">
                      <VIcon
                        start
                        :icon="(item.raw.isActive)? 'mdi-check-circle' : 'mdi-close-circle'"
                        size="12"
                        :color="(item.raw.isActive) ? 'warning' : 'error'"
                      />
                      <span class="text-xs">is active</span>
                    </VCol>
                    <VCol cols="12">
                      <VIcon
                        start
                        :icon="(item.raw.isWithLab)? 'mdi-check-circle' : 'mdi-close-circle'"
                        size="12"
                        :color="(item.raw.isWithLab) ? 'warning' : 'error'"
                      />
                      <span class="text-xs">with laboratory</span>
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VMenu>
          </template>
        </AppTable>
      </VCard>
    </template>
    <template #actions>
      <VBtn
        variant="elevated"
        color="primary"
        @click="onSubmit"
      >
        <VIcon
          start
          icon="tabler-location"
        />
        SUBMIT
      </VBtn>
    </template>
  </AppDialog>
</template>
