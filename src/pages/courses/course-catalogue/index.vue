<script setup>
import Empty from "@/assets/images/downloaded/empty.png";
import CatalogCourseService from "@/services/catalog-course.service";
import useCatalogCourseStore from "@/stores/catalog-course.store";
import { inject, onMounted, watch } from "vue";

// 👉 Bread crumbs
const breadCrumbs = ref([
  {
    title: "Dashbaord",
    href: "/",
    disabled: false
  },
  {
    title: "Course Catalog",
    href: "/courses/course-catalogue",
    disabled: true
  }
])

// 👉 Service
const catalogCourseService = new CatalogCourseService()

// 👉 Store
const catalogCourseStore = useCatalogCourseStore()

// 👉 Selected catalog
const selectedCatalog = ref(null)

// 👉 Current course
const currentCourse = ref(null)

// 👉 Catalog course store
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

const catalogs = computed(() => {
  return catalogCourseStore.getCatalogCourses.map(cc => cc.catalog)
    .filter((value, index, array) => array.findIndex(v => v.id == value.id) == index)
})

const catalogCourses = computed(() => {
  if (!selectedCatalog.value) {
    return []
  }
  
  return catalogCourseStore.getCatalogCourses
    .filter(cc => cc.catalogId == selectedCatalog.value)
    .map(cc => cc.course)
})

async function onDelete() {
  const cc = catalogCourseStore.getCatalogCourses.find(cc => cc.courseId == currentCourse.value && cc.catalogId == selectedCatalog.value)

  if (!cc) return

  swal.value.fire({
    question: "Delete course from catalog?",
    dangerMode: true,
  })
  .then(async result => {
    if (!result) return

    try {
      const { status: code } = await catalogCourseService.delete(cc.id)

      if (code == 204) {
        toast.success("Successfully deleted course from catalog.")
        catalogCourseStore.delete(cc)
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete course from catalog.")
    }
  })
}

watch(selectedCatalog, () => {
  currentCourse.value = catalogCourses.value[0]?.id ?? null
}, { deep: true })

watch(loaded, () => {
  // Set defaults
  selectedCatalog.value = catalogs.value[0]?.id ?? null
  currentCourse.value = catalogCourses.value[0]?.id ?? null
}, { deep: true })

onMounted(async () => {
  try {
    const { status: code, data: response } = await catalogCourseService.getAll()

    if (code == 200) {
      catalogCourseStore.initialize(response)
      loaded.value = true
    }
  } catch (err) {
    console.log(err)
    toast.error(err.response?.data ?? err.message)
  }
})

</script>

<template>
  <section>
    <PageHeader
      title="Course Catalog"
      subtitle="Shows course catalog"
      :breadcrumb="breadCrumbs"
    />

    <VCard>
      <VRow v-if="catalogs.length <= 0">  
        <VCol cols="12" class="text-center mx-auto">
          <div class="d-block w-100 text-center">
            <VImg align="center" class="d-block mx-auto" max-width="60%" :src="Empty" calss="mx-auto" />    
          </div>
          <h3 class="text-h3">No Data Available</h3>
        </VCol>
      </VRow>
      <VRow v-else>
        <VCol cols="4">
          <VList
            rounded="0"
            border
            class="h-100"
            style="border-top: none !important; border-bottom: none !important; border-left: none !important;"
          >
            <template 
              v-if="!loaded"
              v-for="i in 5"
            >
              <VSkeletonLoader :loading="!loaded" type="list-item" />
            </template>
            <template 
              v-else
              v-for="(catalog, index) in catalogs"
              :key="catalog.id"
            >
              <VListItem
                :active="selectedCatalog == catalog.id"
                @click="selectedCatalog = catalog.id"
              >
                <VListItemTitle>{{ catalog.catalogName }}</VListItemTitle>
              </VListItem>    

              <VDivider v-if="index < catalogs.length - 1" />
            </template>
          </VList>  
        </VCol>  
        <VCol cols="8">
          <h5 class="text-h5 my-3">Courses</h5>
          <VCard 
            flat 
            rounded="0"
          >
            <VCardText class="pa-3">
              <template 
                v-if="!loaded"
                v-for="i in 10"
              >
                <VSkeletonLoader :loading="!loaded" type="list-item" />
              </template>

              <VExpansionPanels
                v-else
                variant="accordion"
                mandatory
                v-model="currentCourse"
              >
                <VExpansionPanel 
                  v-for="course in catalogCourses"
                  :key="course.id"
                  :value="course.id"
                >
                  <VExpansionPanelTitle>
                    <div class="d-flex flex-row w-100 align-center justify-space-between">
                      <span class="d-block">{{ course.courseName }} - ({{ course.courseCode }})</span>
                      <VBtn
                        icon=""
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.stop="onDelete"
                      >
                        <VIcon icon="tabler-trash" />
                        <VTooltip activator="parent">Delete course from catalog</VTooltip>
                      </VBtn>
                    </div>
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <VRow>
                      <VCol cols="12">
                        <h5 class="text-h5">Course Information</h5>
                        <VRow no-gutters>
                          <VCol cols="12">
                            <span class="d-flex flex-nowrap w-100 text-xs"><span>UNITS (LAB):</span> <VSpacer /> <span>{{ course.unitsLab }}</span></span>
                          </VCol>
                          <VCol cols="12">
                            <span class="d-flex flex-nowrap w-100 text-xs"><span>UNITS (LEC):</span> <VSpacer /> <span>{{ course.unitsLec }}</span></span>
                          </VCol>
                          <VCol cols="12">
                            <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED HOURS (LAB):</span> <VSpacer /> <span>{{ course.creditHoursLab }}</span></span>
                          </VCol>
                          <VCol cols="12">
                            <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED HOURS (LEC):</span> <VSpacer /> <span>{{ course.creditHoursLec }}</span></span>
                          </VCol>
                          <VCol cols="12">
                            <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED HOURS:</span> <VSpacer /> <span>{{ course.creditHours }}</span></span>
                          </VCol>
                          <VCol cols="12">
                            <span class="d-flex flex-nowrap w-100 text-xs"><span>CREDITED UNITS:</span> <VSpacer /> <span>{{ course.creditsUnit }}</span></span>
                          </VCol>  
                        </VRow>  
                      </VCol>
                      <VCol cols="12">
                        <h5 class="text-h5">Course Requisites</h5>
                        <div 
                          class="d-flex flex-row gap-2 pa-2"
                          style=" border: 2px solid rgba(var(--v-theme-surface));background-color: rgba(var(--v-theme-background));"
                        >
                          <VChip
                            v-for="requisite in course.courseRequisites"
                            :key="`requisite-${requisite.id}`"
                          >
                            {{ requisite.requisite.courseName}}
                          </VChip>  
                        </div>
                      </VCol>  
                    </VRow>
                  </VExpansionPanelText>
                </VExpansionPanel>  
              </VExpansionPanels>    
            </VCardText>  
          </VCard>
        </VCol>

      </VRow>
    </VCard>
  </section>
</template>
