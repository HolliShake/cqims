<script setup>
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
      <VList type="accordion">
        <!-- --------------------------------- Instrument ---------------------------------- -->
        <VListGroup>
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="mdi-microscope"
            >
              <!-- title -->
              <template #title>
                <span class="config-list-title font-weight-bold text-dark text-black text-uppercase">Instruments</span>
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
          <VListItem
            class="py-0"
            style="padding-inline-end: 0 !important; padding-inline-start: 0 !important;"
          >
            <!-- -->
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
          <VListItem style="padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <ExaminationTable />
          </VListItem>
        </VListGroup>
        <!-- --------------------------------- Academic programs ---------------------------------- -->
        <VDivider />
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
          <VListItem style="padding-inline-end: 0 !important; padding-inline-start: 0 !important;">
            <ProgramCategoryTable />
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
</style>
