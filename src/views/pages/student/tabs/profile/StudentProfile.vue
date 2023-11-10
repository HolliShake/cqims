<script setup>
import { helpers } from '@/helpers'
import useStudentStore from '@/stores/student.store'
import AppAvatar from '@/views/pages/global/AppAvatar.vue'
import StudentModal from '@/views/pages/student/StudentModal.vue'
import { inject } from 'vue'

// 👉 Student data
const studentData = inject("studentData")

// 👉 Store
const store = useStudentStore()

const computedCardData = computed(() => {
  return [
    {
      title: "ADDRESS",
      icon: "mdi-home",
      color: "success",
      value: studentData.value.address ?? "Not Set",
    },
    {
      title: "GENDER",
      icon: "mdi-gender-male-female",
      color: "success",
      value: studentData.value.gender ?? "Not Set",
    },
    {
      title: "MOBILE",
      icon: "mdi-cellphone",
      color: "success",
      value: studentData.value.user.phoneNumber ?? "Not Set",
    },
    {
      title: "EMAL",
      icon: "mdi-email",
      color: "success",
      value: studentData.value.user.email ?? "Not Set",
    },
    {
      title: "NATIONALITY",
      icon: "mdi-earth",
      color: "success",
      value: studentData.value.user.nationality ?? "Not Set",
    },
    {
      title: "BIRTHDATE",
      icon: "mdi-calendar",
      color: "success",
      value: (studentData.value.user.birthDate && helpers.formater.dateToWord(studentData.value.user.birthDate)) ?? "Not Set",
    },
  ]
})

// 👉 Is modal visible
const isModalVisible = ref(false)

async function onUpdate() {
  isModalVisible.value = true
  store.setCampus(studentData.value.campusId)
  store.setField({
    id: studentData.value.id,
    email: studentData.value.user.email,
    username: studentData.value.user.username,
    password: "",
    firstName: studentData.value.user.firstName,
    lastName: studentData.value.user.lastName,
    birthDate: studentData.value.user.birthDate,
    studentId: studentData.value.studentId,
    campusId: studentData.value.campusId,
  })
}

watch(studentData, val => {
  store.setCampus(val.campusId)
}, { deep: true, immediate: true })

// 
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="auto"
        >
          <div class="d-flex flex-column flex-md-row gap-3 align-center">
            <div
              class="d-inline-block mx-auto w-auto rounded-circle elevation-5"
              style="border: 3px solid #fff;"
            >
              <AppAvatar
                :size="128"
                :src="studentData.profilePic ?? null"
                :alt="studentData.user.fullName ?? null"
              />
            </div>  
            <!---->
            <div class="text-center text-md-start">
              <div class="d-flex flex-row flex-nowrap gap-2 align-center">
                <h3 class="text-h3 font-weight-bold mb-0">
                  {{ studentData.user.fullName ?? null }}
                </h3>
                <VBtn
                  rounded="sm"
                  density="compact"
                  size="small"
                  variant="elevated"
                  icon=""
                  color="success"
                  @click="onUpdate"
                >
                  <VIcon icon="tabler-pencil" />
                  <VTooltip activator="parent">
                    Edit
                  </VTooltip>
                </VBtn>
              </div>
              <span class="text-subtitle-2 text-xs text-disabled">
                {{ studentData.studentId ?? null }}
              </span>  
            </div>  
          </div>
        </VCol>  
        <VCol
          cols="12"
          class="mb-5 py-0"
        >
          <VDivider />  
        </VCol>
        <VCol
          v-for="cardData in computedCardData"
          :key="cardData.title"
          cols="12"
          sm="6"
          md="4"
          xl="3"
        >
          <VCard style="border: 2px solid rgb(var(--v-theme-surface)); background-color: rgb(var(--v-theme-background));">
            <VCardText class="pa-3">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex flex-row gap-2 align-center">
                    <VIcon
                      size="30"
                      :icon="cardData.icon"
                      color="success"
                    />

                    <span class="d-block text-md font-weight-bold">{{ cardData.title }}</span>
                  </div>  
                </VCol>  
                <VCol
                  cols="12"
                  class="py-0"
                >
                  <VDivider />  
                </VCol>
                <VCol cols="12">
                  <h6 class="text-h6 font-weight-bold text-center text-dark">
                    {{ cardData.value }}
                  </h6>  
                </VCol>
              </VRow>
            </VCardText>  
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard> 

  <StudentModal
    v-model="isModalVisible"
    :is-update-mode="!!true"
  />
</template>
