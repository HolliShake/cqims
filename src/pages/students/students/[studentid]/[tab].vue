<script setup>
import StudentContext from "@/context/StudentContext.vue"
import useStudentContext from "@/context/useStudentContext"
import { helpers } from "@/helpers"
import useParentStore from "@/stores/parent.store"
import StudentParent from "@/views/pages/student/tabs/parent/StudentParent.vue"
import StudentProfile from "@/views/pages/student/tabs/profile/StudentProfile.vue"
import { watch } from "vue"
import { useRouter } from 'vue-router'

const props = defineProps({
  studentid: {
    type: String,
    required: true,
  },
  tab: {
    type: String,
    default: "profile",
  },
})

const router = useRouter()

const breadCrumbs = computed(() => {
  return [
    {
      text: "Dashboard",
      disabled: false,
      href: "/dashboard",
    },
    {
      text: "Students",
      disabled: false,
      href: "/students/students",
    },
    {
      text: "Student",
      disabled: true,
      href: "#",
    },
    {
      text: currentTab.value.toLowerCase(),
      disabled: true,
      href: "#",
    },
  ]
})

// 👉 List of tabs
const tabs = ref([
  {
    title: "PROFILE",
    key: "profile",
    icon: 'tabler-user',
  },
  {
    title: "PARENT",
    key: "parent",
    icon: 'tabler-users',
  },
  {
    title: "HEALTH",
    key: "health",
    icon: 'tabler-first-aid-kit',
  },
  {
    title: "EDUCATION",
    key: "education",
    icon: 'tabler-school',
  },
  {
    title: "SKILLS",
    key: "skills",
    icon: 'tabler-barbell',
  },
  {
    title: "ACHIEVEMENT",
    key: "achievement",
    icon: 'tabler-award',
  },
])

// 👉 Parent Store
const parentStore = useParentStore()

// 👉 Context store
const contextStore = useStudentContext

// 👉 Current tab
const currentTab = ref(props.tab)

// 👉 Current active tab (Capitalized)
const computedTab = computed(() => {
  const char0 = currentTab.value.charAt(0).toUpperCase()
  
  return char0 + (currentTab.value.slice(1).toLowerCase())
})


function getValidTab(tabKey) {
  const t = {
    profile: StudentProfile,
    parent: StudentParent,
  }

  return t[tabKey]
}

watch(currentTab, tab => {
  router.push({
    name: 'students-students-studentid-tab',
    params: {
      studentid: props.studentid,
      tab: tab,
    },
    props: true,
  })
}, { deep: true })

watch(contextStore, ctx => {
  parentStore.setChild(ctx.getStudentData.user.id)
}, { deep: true })

// 
</script>

<template>
  <StudentContext :studentid="helpers.security.decrypt(props.studentid)">
    <PageHeader
      :title="`Student's ${computedTab}`"
      subtitle="Student Information"
      :breadcrumb="breadCrumbs"
    />
    <VRow>
      <VCol cols="12">
        <VTabs v-model="currentTab">
          <VTab
            v-for="t in tabs"
            :key="t.key"
            :value="t.key"
          >
            <VIcon
              start
              :icon="t.icon"
            />
            <span>{{ t.title }}</span>
          </VTab>  
        </VTabs>
      </VCol>  
      <!--  -->
      <VCol cols="12">
        <VWindow v-model="currentTab">
          <VWindowItem
            v-for="t in tabs"
            :key="t.key"
            :value="t.key"
          >
            <Component :is="getValidTab(t.key)" />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
  </StudentContext>
</template>

<route lang="yaml">
  meta:
    navActiveLink: students-students
</route>
