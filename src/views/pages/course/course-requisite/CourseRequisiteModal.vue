<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
import CourseService from "@/services/course.service"
import useCourseRequisiteStore from "@/stores/course-requisite.store"
import useCourseStore from "@/stores/course.store"
import { inject, watch } from "vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isUpdateMode: {
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
    width: "100%",
  },
  
  {
    title: "MORE",
    key: "more",
    align: "center",
  },
])

// 👉 Services
const courseService = new CourseService()

// 👉 Store
const courseStore = useCourseStore()
const courseRequisiteStore = useCourseRequisiteStore()

// 👉 Visibility
const visible = ref(false)

// 👉 Computed is update flag
const isUpdateMode = computed(() => { 
  return props.isUpdateMode
})

// 👉 Toast
const toast = inject('toast')

// 👉 Search
const search = ref("")

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
  if (await refVForm.value.validate()) (!isUpdateMode.value) ? await onCreate() : await onUpdate()
}

// 👉 On create campus
async function onCreate() 
{
  try {
    const { status: code, data: response, message: error } = await courseService.createCourse(formState.value)

    if (code >= 200 && code <= 299)
    {
      courseStore.add(response)
      toast.success("Course successfully created.")

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

// 👉 On update campus
async function onUpdate() 
{
  try {
    const { status: code, data: response, message: error } = await courseService.updateCourse(formState.value.id, formState.value)

    if (code >= 200 && code <= 299)
    {
      courseStore.update(response)
      toast.success("Course successfully updated.")

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
      Course Details
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
          :headers="tableHeaders"
          :items="data"
          expand-on-click
          show-select
        >
          <template #item.more="{ item }">
            <VMenu
              location="start"
              open-on-hover
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
                  asd
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
        :color="(!isUpdateMode) ? 'primary' : 'secondary'"
        @click="onSubmit"
      >
        <VIcon
          start
          :icon="(!isUpdateMode)? 'tabler-location' : 'tabler-edit'"
        />
        {{ (!isUpdateMode) ? 'SUBMIT' : 'UPDATE' }}
      </VBtn>
    </template>
  </AppDialog>
</template>
