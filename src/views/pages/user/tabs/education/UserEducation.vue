
<script setup>
import { helpers } from '@/helpers'
import EducationModal from './EducationModal.vue'

// 👉 Modal visibility
const isModalVisible = ref(false)

// 👉 Update flag
const isUpdateMode = ref(false)

const items = computed(() => {
  return [
    {
      schoolName: "Iponan Elementary School",
      from: new Date(Date.parse("2006/06/12")),
      to: new Date(Date.parse("2012/03/31")),
      description: "Basta",
    },
    {
      schoolName: "Iponan National High School",
      from: new Date(Date.parse("2012/06/12")),
      to: new Date(Date.parse("2016/03/18")),
      description: "",
    },
    {
      schoolName: "Phinma-Cagayan de Oro College",
      from: new Date(Date.parse("2016/06/12")),
      to: new Date(Date.parse("2018/04/08")),
      description: "",
    },
    {
      schoolName: "University of Science and Technology of Southern Philippines",
      from: new Date(Date.parse("2018/06/12")),
      to: new Date(Date.parse("2022/08/12")),
      description: "",
    },
  ]
})

async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

// 
</script>

<template>
  <VCard>
    <VCardText class="d-block">
      <div class="d-flex flex-row flex-nowrap align-center gap-2 mb-4">
        <VIcon
          icon="mdi-school"
          size="30"
        />
        <h1 class="font-weight-thin">
          Educational Background
        </h1>  
      </div>
      <VTimeline
        side="end"
        align="start"
        line-inset="8"
        truncate-line="both"
        density="compact"
      >
        <!--  -->
        <VTimelineItem
          v-for="(education, index) in items"
          :key="`item-${index}`"
          size="x-small"
          dot-color="success"
        >
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
            <div>
              <span class="app-timeline-title">
                {{ education.schoolName }}
              </span>
              <span class="d-block app-timeline-meta">{{ helpers.formater.dateToWord(education.from) }} &nbsp;-&nbsp; {{ education.to ? helpers.formater.dateToWord(education.to) : "Present" }}</span>  
            </div>

            <div class="d-flex flex-row gap-1 align-center">
              <VBtn
                icon=""
                variant="text"
                size="x-small"
                color="success"
                @click.stop="$event => null"
              >
                <VIcon icon="tabler-edit" />
              </VBtn>
              <VBtn
                icon=""
                variant="text"
                size="x-small"
                color="error"
                @click.stop="$event => null"
              >
                <VIcon icon="tabler-trash" />
              </VBtn>
            </div>
          </div>

          <!-- 👉 Content -->
          <div class="app-timeline-text my-1">
            {{ education.description }}
          </div>
        </VTimelineItem>
      </VTimeline>
      <div class="d-flex flex-row flex-nowrap justify-center w-100 py-3">
        <VBtn
          variant="elevated"
          rounded="pill"
          @click="onCreate"
        >
          <VIcon
            start
            icon="tabler-flag"
          />
          CREATE
        </VBtn>
      </div>
    </VCardText>
  </VCard>

  <EducationModal
    v-model="isModalVisible"
    :is-update-mode="isUpdateMode"
  />
</template>
