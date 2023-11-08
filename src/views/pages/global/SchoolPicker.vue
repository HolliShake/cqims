<script setup>
import SchoolService from "@/services/school.service"
import useSchoolStore from "@/stores/school.store"
import { inject, onMounted, watch } from "vue"
import useSchoolPicker from "./useSchoolPicker"

// 👉 Services
const schoolService = new SchoolService()

// 👉 Store
const schoolStore = useSchoolStore()
const schoolPicker = useSchoolPicker

// 👉 Loaded flag
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Data
const data = computed(() => { 
  return schoolStore.getSchools
    .map(s => ({
      title: s.schoolShortName,
      value: s.id,
      campuses: s.campuses ?? [],
    }))
})

// 👉 Model
const model = ref((() => schoolPicker.getSelectedSchool)()) 
const campusModel = ref((() => schoolPicker.getSelectedCampus)()) 

watch(data, data => {
  if (data.length > 0 && !(data.map(d => d.value).includes(model.value)))
  {
    model.value = data[0].value
    campusModel.value = data[0].campuses[0]?.id ?? null
  }
}, { deep: true })

watch(model, selectedSchoolId => {
  schoolPicker.setSelectedSchool(selectedSchoolId)

  if (selectedSchoolId)
  {
    const school = data.value.find(d => d.value == selectedSchoolId)

    campusModel.value = school.campuses[0]?.id ?? null
  }
}, { deep: true })

watch(campusModel, selectedCampusId => {
  schoolPicker.setSelectedCampus(selectedCampusId)
}, { deep: true })

onMounted(async () => {
  schoolStore.clear()

  try 
  {
    const { status: code, data: response, message: error } = await schoolService.getAllSchool()
  
    if (code == 200)
    {
      schoolStore.initialize(response)
      loaded.value = true
    } else {
      toast.error(error)
    }
  } catch (err) {
    console.log(err)
    toast.error(err.response?.data ?? err.message)
  }
})

// 
</script>

<template>
  <div style="width: auto !important; max-width: fit-content;">
    <VMenu
      location="top"
      :close-on-content-click="false"
    >
      <template #activator="{ props }">
        <VBtn
          v-bind="props"
          flat
          border
          color="none"
        >
          {{ (data.find(d => d.value == model)?.title ?? "...") + ((!campusModel) ? '' : (((data.length > 0) || "") && (" | " + (data.find(d => d.value == model)?.campuses.find(c => c.id == campusModel)?.campusShortName)))) }}
        </VBtn>
      </template>

      <VList>
        <template
          v-for="(school, index) in data"
          :key="`menu-${index}`"
        >
          <VListItem
            v-if="school.campuses.length <= 0"
            :active="school.value == model"
            @click="() => { model = school.value; campusModel = null; }"
          >
            {{ school.title }}
          </VListItem>    
          <VMenu
            v-else
            location="left"
            offset="10"
            :open-on-hover="!!true"
            :close-on-content-click="!!true"
          >
            <template #activator="{ props }">
              <VListItem
                v-bind="props"
                :active="school.value == model"
                @click="model = school.value"
              >
                {{ school.title }}
              </VListItem>    
            </template>

            <VList>
              <VListItem
                v-for="(campus, index1) in school.campuses"
                :key="`campus-${index1}`"
                :active="campus.id == campusModel"
                @click="() => { model = school.value; campusModel = campus.id; }"
              >
                {{ campus.campusShortName }}
              </VListItem>
            </VList>
          </VMenu>
        </template>
      </VList>
    </VMenu>
  </div>
</template>
