
<script setup>
import useStudentContext from '@/context/useStudentContext'
import { helpers } from '@/helpers'
import EducationService from '@/services/education.service'
import useEducationStore from '@/stores/education.store'
import Empty from "@images/downloaded/empty.png"
import EducationModal from './EducationModal.vue'

// 👉 Service
const educationService = new EducationService()

// 👉 Store
const educationStore = useEducationStore()

// 👉 Context
const studentContext = useStudentContext

// 👉 Modal visibility
const isModalVisible = ref(false)

// 👉 Update flag
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject('toast')

// 👉 Swal
const swal = inject("swal")

const items = computed(() => {
  return educationStore.getEducations
})

async function onCreate() {
  isModalVisible.value = true
  isUpdateMode.value = false
}

async function onUpdate(education) {
  isModalVisible.value = true
  isUpdateMode.value = true
  educationStore.setField(education)
}

async function onDelete(education) {
  swal.value.fire({
    question: "Are you sure you want to delete this education info?",
    dangerMode: true,
  })
    .then(async result => {
      
      if (!result) return

      try
      {
        const { status: code, data: response } = await educationService.deleteUserEducation(education.id)

        if (code >= 200 && code <= 299)
        {
          toast.success("Successfully deleted user education.")
          educationStore.delete(education)
        }
      } catch (error) {
        toast.error(error.response?.data ?? error.message)
      }

    })
}

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await educationService.getEducationsByUserId(studentContext.getStudentData.user.id)

    if (code == 200)
    {
      console.log(response)
      educationStore.initilize(response)
    }
  } catch (error) {
    toast.error(error.response?.data ?? error.message)
  }
})

// 
</script>

<template>
  <VCard>
    <VCardText class="d-block">
      <div
        v-if="items.length <= 0"
        class="d-block"
      >
        <VImg
          :src="Empty"
          alt="Empty icon"
          cover
          width="100%"
          max-width="512"
          class="mx-auto"
        />
        <span class="d-flex flex-row justify-center align-center">
          <h2 class="d-inline">Nothing To Show</h2>
          <VBtn
            variant="text"
            @click="onCreate"
          >
            create
          </VBtn>
        </span>
      </div>
      <template v-else>
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
                <i class="d-block app-timeline-meta">{{ helpers.formater.dateToWord(education.from) }} &nbsp;-&nbsp; {{ education.to ? helpers.formater.dateToWord(education.to) : "Present" }}</i>  
              </div>

              <div class="d-flex flex-row gap-1 align-center">
                <VBtn
                  icon=""
                  variant="text"
                  size="x-small"
                  color="success"
                  @click.stop="$event => onUpdate(education)"
                >
                  <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn
                  icon=""
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.stop="$event => onDelete(education)"
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
      </template>
    </VCardText>
  </VCard>

  <EducationModal
    v-model="isModalVisible"
    :is-update-mode="isUpdateMode"
  />
</template>
