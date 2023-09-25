<script setup>
import CourseModal from "@/views/pages/course/courses/CourseModal.vue"

const tableHeaders = ref([
  {
    title: "COURSE NAME",
    key: "courseName",
  },
  {
    title: "CODE",
    key: "courseShortName",
  },
  {
    title: "ACTION",
    key: "action",
    align: "center",
  },
])

// 👉 Modal visiblity
const isCourseModalVisible = ref(false)

// 👉 Is update mode
const isUpdateMode = ref(false)

// 👉 On create event
async function onCreate()
{
  isCourseModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 On create event
async function onUpdate(courseRaw)
{
  isCourseModalVisible.value = true
  isUpdateMode.value = true
}
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
      <AppTable :headers="tableHeaders" />
    </VCard>

    <!-- To app -->
    <CourseModal
      v-model="isCourseModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </section>
</template>
