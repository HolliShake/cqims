<script setup>
import { helpers } from "@/helpers"
import StudentService from "@/services/student.service"
import useStudentStore from "@/stores/student.store"
import AppAvatar from "@/views/pages/global/AppAvatar.vue"
import useSchoolPicker from "@/views/pages/global/useSchoolPicker"
import StudentModal from "@/views/pages/student/StudentModal.vue"
import { computed, watch } from "vue"

const { selectedCampus } = useSchoolPicker

const breadCrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Students",
    disabled: true,
    href: "#",
  },
])

const tableHeaders = ref([
  {
    title: "STUDENT NAME",
    key: "user.fullName",
    sortable: true,
  },
  {
    title: "EMAIL",
    key: "user.email",
  },
  {
    title: "ACTION",
    key: "action",
    width: "130px",
    align: "center",
  },
])

// 👉 Service
const studentService = new StudentService()

// 👉 Store
const studentStore = useStudentStore()

// 👉 Search
const search = ref("")

// 👉 Modal visiblity
const isStudentModalVisible = ref(false)

// 👉 Update flag
const isUpdateMode = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

// 👉 Loaded
const loaded = ref(false)

// 👉 Can add flag
const canAdd = computed(() => !!studentStore.getCampusId)

// 👉 Actual data
const data = computed(() => {
  return studentStore.getStudents
    .filter(student => 
      student.user.fullName.toLowerCase().startsWith(search.value.toLowerCase()) ||
      student.studentId.toString().toLowerCase().startsWith(search.value.toLowerCase())
    )
})

// 👉 Create student
async function onCreateStudent()
{
  isStudentModalVisible.value = true
  isUpdateMode.value = false
}

// 👉 Update student
async function onUpdate(student)
{
  isStudentModalVisible.value = true
  isUpdateMode.value = true
  studentStore.setField({
    id: student.raw.id,
    email: student.raw.user.email,
    username: student.raw.user.username,
    password: "",
    firstName: student.raw.user.firstName,
    lastName: student.raw.user.lastName,
    birthDate: student.raw.user.birthDate,
    studentId: student.raw.studentId,
    campusId: student.raw.campusId,
  })
}

async function onDeleteStudent(student)
{
  swal.value.fire({
    question: `Delete student "${ student.user.fullName }"?`,
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response, message: error } = await studentService.deleteStudent(student.id)

        if (code >= 200 && code <= 299)
        {
          await studentStore.delete(student)
          toast.success("Student deleted successfully.")
        } else 
        {
          toast.error(error)
        }
      } catch (err) {
        toast.error(err.response?.data ?? err.message)
      } 

    })
}

watch(useSchoolPicker, async picker => {
  if (!picker.selectedCampus) return

  loaded.value = false
  studentStore.clear()
  studentStore.setCampus(picker.selectedCampus)

  try
  {
    const { status: code, data: response } = await studentService.getAllStudentByCampusId(picker.selectedCampus)

    if (code == 200)
    {
      loaded.value = true
      studentStore.initialize(response)
      console.log(response)
    }

  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data ?? error.message)
  }
}, { deep: true, immediate: true })

// 
</script>

<template>
  <section>
    <PageHeader
      title="Students"
      subtitle="List of students"
      :breadcrumb="breadCrumbs"
    />
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-4">
            <VRow>
              <VCol
                cols="12"
                md="3"
              >
                <VTextField v-model="search" label="Search student id or name" />
              </VCol>
              <VCol cols="auto">
                <ItemsPerPage :dense="!!false" />  
              </VCol>
              <VCol
                cols="12"
                md="auto"
                class="ms-auto"
              >
                <VBtn
                  :disabled="!canAdd"
                  block
                  color="error"
                >
                  <VIcon 
                    start 
                    icon="tabler-file-spreadsheet" 
                  />
                  UPLOAD FROM EXCEL FILE
                </VBtn>
              </VCol>
              <VCol
                cols="12"
                md="auto"
              >
                <VBtn
                  :disabled="!canAdd"
                  block
                  @click="onCreateStudent"
                >
                  CREATE STUDENT
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
          <AppTable
            :headers="tableHeaders"
            :items="data"
            :loading="!loaded"
            :model-value="[1006]"
            @click:row="onUpdate"
          >
            <!--  -->
            <template #item.user.fullName="{ item }">
              <div class="d-flex flex-row flex-nowrap align-center gap-3">
                <AppAvatar
                  :src="item.raw.profilePath"
                  :alt="item.raw.user.fullName"
                />
                <div>
                  <span class="d-block font-weight-bold">{{ item.raw.user.fullName }}</span>
                  <span class="d-block mt-n1 text-xs">{{ item.raw.studentId }}</span>
                </div>
              </div>
            </template>

            <!--  -->
            <template #item.action="{ item }">
              <div class="d-flex flex-row gap-2">
                <RouterLink
                  :to="{
                    name: 'students-students-studentid-tab',
                    params: {
                      studentid: helpers.security.encrypt(item.raw.id),
                      tab: 'profile',
                    },
                    props: true
                  }"
                >
                  <VBtn
                    icon=""
                    color="success"
                    size="small"
                    variant="text"
                    @click.stop="$event => null"
                  >
                    <VIcon icon="tabler-user-cog" />
                    <VTooltip activator="parent">
                      view user
                    </VTooltip>
                  </VBtn>
                </RouterLink>
                <VBtn
                  icon=""
                  color="error"
                  size="small"
                  variant="text"
                  @click.stop="onDeleteStudent(item.raw)"
                >
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </div>
            </template>
          </AppTable>
        </VCard>
      </VCol>
    </VRow>
    
    <StudentModal
      v-model="isStudentModalVisible"
      :is-update-mode="isUpdateMode"
    />
  </section>
</template>
