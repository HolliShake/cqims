<script setup>
import StudentService from '@/services/student.service'
import { inject, onMounted, provide } from 'vue'
import useStudentContext from "./useStudentContext"

const props = defineProps({
  studentid: {
    type: [String, Number],
    required: true,
  },
})

// 👉 Service
const studentService = new StudentService()

// 👉 Context store
const contextStore = useStudentContext

// 👉 Toast
const toast = inject("toast")

// 👉 Actual data
const studentData = computed(() => {
  return contextStore.getStudentData
})

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Pass to children
provide("studentData", studentData)

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await studentService.getStudentById(props.studentid)

    if (code == 200)
    {
      loaded.value = true
      contextStore.setStudentData(response)
      console.log(`Welcome ${ response.user.fullName }!`)
    }

  } catch (error) {
    toast.error("Failed to load student data...")
  }
})

// 
</script>

<template>
  <section>
    <VSkeletonLoader
      v-if="!loaded"
      :loading="!loaded"
      type="card, article"
    />
    <slot v-else />
  </section>
</template>
