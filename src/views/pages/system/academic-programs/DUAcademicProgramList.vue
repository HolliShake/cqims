<script setup>
const tableHeaders = ref([
  {
    title: "PROGRAM NAME",
  },
  {
    title: "PROGRAM CATEGORY",
  },
  {
    title: "BOARD RES NO.",
  },
  {
    title: "YEAR OFFERED",
  },
  {
    title: "DATE APPROVED",
  },
  {
    title: "EXAMINATION",
  },
  {
    title: "INFO",
  },
  {
    title: "ACTION",
    key: "action",
  },
])

const itemsPerPage = ref(10)

// 
</script>


<template>
  <div>
    <div class="mb-4">
      <VRow>
        <VCol
          cols="8"
          md="4"
        >
          <VTextField label="Search program" />
        </VCol>
        <VCol
          cols="4"
          md="auto"
        >
          <ItemsPerPage
            v-model="itemsPerPage"
            style="width: auto !important; max-width: 5em !important;"
            :dense="!!false"
          />
        </VCol>
        <VCol
          cols="12"
          md="auto"
          class="ms-auto"
        >
          <VBtn block>
            <VIcon
              start
              icon="tabler-stack-2"
            />
            CREATE PROGRAM
          </VBtn>
        </VCol>
      </VRow>  
    </div>
    <VCard
      rounded="0"
      flat
      border
      style="border-top: none !important;"
    >
      <AppTable
        :headers="tableHeaders"
        :items-per-page="itemsPerPage"
      />  
    </VCard>  
  </div>
</template>
