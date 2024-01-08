<script setup>
import AcademicTermTable from "@/views/pages/system/academic-term/AcademicTermTable.vue"
import CatalogView from "@/views/pages/system/catalog/CatalogView.vue"
import DisciplineView from "@/views/pages/system/discipline/DisciplineView.vue"
import ExaminationTable from "@/views/pages/system/examination/ExaminationTable.vue"
import ProgramCategoryTable from "@/views/pages/system/program-category/ProgramCategoryTable.vue"

const breadCrumbs = ref([
  {
    text: "Dashboard",
    disabled: false,
    href: "/dashboard",
  },
  {
    text: "Configuration",
    disabled: true,
    href: "#",
  },
])

// 
</script>

<template>
  <section>
    <PageHeader
      title="Configuration"
      subtitle="Academic configurations"
      :breadcrumb="breadCrumbs"
    />

    <VCard>
      <VList
        class="configuration-v-list"
        type=""
      >
        <!-- --------------------------------- Academic programs ---------------------------------- -->
        <VListGroup>
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="mdi-script"
            >
              <!-- title -->
              <template #title>
                <span class="config-list-title font-weight-bold text-dark text-black text-uppercase">Academic Program Categories</span>
              </template>
              <!-- activator -->
              <template #append="{ isActive }">
                <VIcon
                  color="success"
                  :icon="isActive? 'tabler-arrow-badge-up-filled' : 'tabler-arrow-badge-down-filled'"
                />
              </template>
            </VListItem>
          </template>
          <!-- content -->
          <VListItem style="padding-block-end: 0 !important; padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <ProgramCategoryTable />
          </VListItem>
        </VListGroup>
        <!-- --------------------------------- Academic Term ---------------------------------- -->
        <VDivider />
        <VListGroup>
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="mdi-calendar"
            >
              <!-- title -->
              <template #title>
                <span class="config-list-title font-weight-bold text-dark text-black text-uppercase">Academic Term</span>
              </template>
              <!-- activator -->
              <template #append="{ isActive }">
                <VIcon
                  color="success"
                  :icon="isActive? 'tabler-arrow-badge-up-filled' : 'tabler-arrow-badge-down-filled'"
                />
              </template>
            </VListItem>
          </template>
          <!-- content -->
          <VListItem style="padding-block-end: 0 !important; padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <AcademicTermTable />
          </VListItem>
        </VListGroup>
        <!-- --------------------------------- Catalog ---------------------------------- -->
        <VDivider />
        <VListGroup>
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="mdi-list-box"
            >
              <!-- title -->
              <template #title>
                <span class="config-list-title font-weight-bold text-dark text-black text-uppercase">Catalog</span>
              </template>
              <!-- activator -->
              <template #append="{ isActive }">
                <VIcon
                  color="success"
                  :icon="isActive? 'tabler-arrow-badge-up-filled' : 'tabler-arrow-badge-down-filled'"
                />
              </template>
            </VListItem>
          </template>
          <!-- content -->
          <VListItem style="padding-block-end: 0 !important; padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <CatalogView />
          </VListItem>
        </VListGroup>
        <!-- --------------------------------- Discipline ---------------------------------- -->
        <VDivider />
        <VListGroup>
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="mdi-lightbulb-on-30"
            >
              <!-- title -->
              <template #title>
                <span class="config-list-title font-weight-bold text-dark text-black text-uppercase">Disciplines</span>
              </template>
              <!-- activator -->
              <template #append="{ isActive }">
                <VIcon
                  color="success"
                  :icon="isActive? 'tabler-arrow-badge-up-filled' : 'tabler-arrow-badge-down-filled'"
                />
              </template>
            </VListItem>
          </template>
          <!-- content -->
          <VListItem style="padding-block-end: 0 !important; padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <DisciplineView />
          </VListItem>
        </VListGroup>
        <!-- --------------------------------- Examinations ---------------------------------- -->
        <VDivider />
        <VListGroup>
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="mdi-pencil"
            >
              <!-- title -->
              <template #title>
                <span class="config-list-title font-weight-bold text-dark text-black text-uppercase">Examinations</span>
              </template>
              <!-- activator -->
              <template #append="{ isActive }">
                <VIcon
                  color="success"
                  :icon="isActive? 'tabler-arrow-badge-up-filled' : 'tabler-arrow-badge-down-filled'"
                />
              </template>
            </VListItem>
          </template>
          <!-- content -->
          <VListItem style="padding-block-end: 0 !important; padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <ExaminationTable />
          </VListItem>
        </VListGroup>
      </VList>
    </VCard>
  </section>
</template>

<style lang="scss">
.config-list-title {
  user-select: none;
}

/* eslint-disable-next-line max-len */
.configuration-v-list > .v-list-group:not(:last-child) .v-list-group__items > .v-list-item > .v-list-item__content > .v-card {
  border-block-end: none !important;
}
</style>
