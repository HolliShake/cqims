<script setup>
import CatalogService from '@/services/catalog.service';
import useCatalogStore from '@/stores/catalog.store';
import { computed, inject, onMounted } from 'vue';
import CatalogModal from './CatalogModal.vue';

const headers = ref([
  {
    title: "CATALOG",
    key: "catalogName"
  },
  {
    title: "DESCRIPTION",
    key: "catalogDescription",
  },
  {
    title: "STATUS",
    key: "isActive",
    sortable: false,
    align: "center"
  },
  {
    title: "ACTION",
    key: "action",
    sortable: false,
    align: "center"
  }
])

// 👉 Catalog service
const catalogService = new CatalogService()

// 👉 Catalog Model
const catalogStore = useCatalogStore()

// 👉 Modal ref
const modalRef = ref()

// 👉 Search catalog model
const searchCatalog = ref("")

// 👉 Items per page default 10
const itemsPerPage = ref(10)

// 👉 Catalog loaded
const loaded = ref(false)

// 👉 Toast
const toast = inject("toast")

// 👉 Swal
const swal = inject("swal")

const data = computed(() => {
  return catalogStore.getCatalogs
    .filter(catalog => catalog.catalogName.toLowerCase().startsWith(searchCatalog.value.toLowerCase()))
})

async function onUpdate(item) {
  modalRef.value.openAsUpdateMode(item.raw)
}

async function onDelete(catalog) {
  swal.value.fire({
    question: "Delete catalog " + `${catalog.catalogName}?`,
    dangerMode: true,
  })
  .then(async result => {
    if (!result) return

    try {
      const { status: code } = await catalogService.delete(catalog.id)
      
      if (code == 204) {
        toast.success("Successfully deleted catalog.")
        catalogStore.delete(catalog)
      }
    } catch (err) {
      toast.error("Failed to delete catalog.")
    }

  })
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await catalogService.getAll()

    if (code == 200) {
      catalogStore.initialize(response)
      loaded.value = true
    }
  } catch (err) {
    toast.error(err.response?.data ?? err.mressage)
  }
})

// 
</script>


<template>
  <VCard
    rounded="0"
    flat
    border
  >
    <VCardText class="pa-3">
      <VRow>
        <VCol 
          cols="12" 
          md="3"
        >
          <VTextField
            v-model="searchCatalog" 
            label="Search catalog"
          />
        </VCol>
        <VCol
          cols="4"
          md="auto"
        >
          <ItemsPerPage
            v-model="itemsPerPage"
            :dense="!!false"
            style="width: 100%;"
          />  
        </VCol>
        <VCol 
          class="ms-auto" 
          cols="12" 
          md="auto"
        >
          <VBtn
            block
            @click="modalRef.open()"
          >
            <VIcon
              start
              icon="tabler-pencil-plus"
            />
            CREATE ENTRY
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <AppTable
      :headers="headers"
      :items="data"
      :items-per-page="itemsPerPage"
      @click:row="onUpdate"
    >
      <template #item.isActive="{ item }">
        <VChip
          :color="item.raw.isActive ? 'success':'error'"
          rounded="sm"
        >
          {{ item.raw.isActive ? "Active" : "Inactive" }}  
        </VChip>
      </template>

      <template #item.action="{ item }">
        <VBtn
          variant="text"
          icon=""
          color="error"
          size="small"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon icon="tabler-trash" />
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <CatalogModal 
    ref="modalRef"
  />
</template>
