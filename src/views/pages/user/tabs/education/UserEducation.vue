
<script setup>
import useStudentContext from '@/context/useStudentContext'
import { helpers } from '@/helpers'
import EducationService from '@/services/education.service'
import useEducationStore from '@/stores/education.store'
import Empty from "@images/downloaded/empty.png"
import EducationModal from './EducationModal.vue'

const educationService = new EducationService()
const educationStore = useEducationStore()
const studentContext = useStudentContext
const modalRef = ref()
const toast = inject('toast')
const swal = inject("swal")

const items = computed(() => {
  return educationStore.getEducations
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(education) {
  modalRef.value.openAsUpdateMode(education)
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
        <div class="d-flex flex-row flex-nowrap align-center justify-space-between gap-2 mb-4">
          <div class="d-flex flex-row flex-nowrap gap-2">
            <VIcon
              icon="mdi-school"
              size="30"
            />
            <h1 class="font-weight-thin">
              Educational Background
            </h1>  
          </div>

          <VBtn
            variant="elevated"
            rounded="pill"
            size="small"
            @click="onCreate"
          >
            <VIcon
              start
              icon="tabler-flag"
            />
            CREATE
          </VBtn>
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
      </template>
    </VCardText>
  </VCard>

  <EducationModal
    ref="modalRef"
  />
</template>
