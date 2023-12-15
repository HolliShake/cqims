<script setup>
import { helpers } from '@/helpers'
import SkillService from '@/services/skill.service'
import useSkillStore from '@/stores/skill.store'
import { h } from 'vue'
import SkillModal from './SkillModal.vue'

const skillService = new SkillService()
const authContext = inject("authContext")
const skillStore = useSkillStore()
const search = ref('')
const itemsPerPage = ref(10)
const modalRef = ref()
const toast = inject("toast")
const swal = inject("swal")

const headers = ref([
  {
    title: "SKILL NAME",
    key: "skillName",
    width: '100%',
    value: v => h('span', { class: 'font-weight-bold text-sm' }, v.skillName),
    sortable: false,
  },
  {
    title: "RATE",
    key: "skillProgress",
    align: 'center'
  },
  {
    title: "ACTION",
    key: "action",
    sortable: false,
  }
])

const items = computed(() => {
  return skillStore.getSkills
    .filter(s => s.skillName.toLowerCase().includes(search.value.toLowerCase()))
})

const self_assisted = computed(() => {
  return items.value
    .filter(s => s.skillAssessmentType == 0)
})

const from_evaluation = computed(() => {
  return items.value
    .filter(s => s.skillAssessmentType == 1)
})

async function onUpdate(skill) {
  modalRef.value.openAsUpdateMode(skill.raw)
}

async function onDelete(skill) {
  swal.value.fire({
    question: "Are you sure you want to delete this skill?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try
      {
        const { status: code } = await skillService.deleteSkill(skill.id)

        if (code == 204) {
          toast.success("Successfully deleted skill.")
          skillStore.delete(skill)
        }
      } catch (error) {
        toast.error(error.response?.data ?? error.message)
      }
    })
}

onMounted(async () => {
  skillStore.setUser(authContext.value.id)

  try
  {
    const { status: code, data: response } = await skillService.getSkillsByUserId(authContext.value.id)

    if (code == 200) {
      console.log(response);
      skillStore.initialize(response)
    }
  } catch (error) {
    toast.error(error.response?.data ?? error.message)
  }
})

// 
</script>

<template>
  <VCard>
    <VCardText
      class="pa-4"
    >
      <VRow>
        <VCol 
          cols="12"
          md="4"
        >
          <VTextField 
            v-model="search"
            label="Search"
          />
        </VCol>
        <VCol 
          cols="12"
          md="auto"
        >
          <ItemsPerPage 
            v-model="itemsPerPage"
            style="width: auto;"
          />
        </VCol>
        <VCol 
          cols="12"
          md="auto"
          class="ms-auto"
        >
          <VBtn
            block
            color="primary"
            @click="modalRef.open()"
          >
            <VIcon 
              start
              icon="tabler-location-plus"
            />
            ADD SKILL
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <VCol cols="12">
      <VChip
        rounded="sm"
        color="success"
        variant="tonal"
      >
        <h3>SELF ASSISTED SKILLS</h3>
      </VChip>
    </VCol>
    <AppTable
      class="student-skill-table"
      :headers="headers"
      :items="self_assisted"
      :items-per-page="itemsPerPage"
      @click:row="onUpdate"
    >
      <template #item.skillProgress="{ item }">
        <VProgressCircular
          :size="35"
          :width="4"
          :model-value="item.raw.skillProgress"
          :color="helpers.resolver.getColor(item.raw.skillProgress)"
        >
          <span class="text-xs">{{ item.raw.skillProgress }}</span>
        </VProgressCircular>
      </template>

      <template #item.action="{ item }">
        <VBtn
          icon=""
          variant="text"
          size="small"
          color="error"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon 
            icon="tabler-trash"
          />
          <VTooltip activator="parent" >Delete Skill</VTooltip>
        </VBtn>
      </template>
    </AppTable>
    <VCol cols="12">
      <VChip
        rounded="sm"
        color="success"
        variant="tonal"
      >
        <h3>SKILLS FROM EVALUATION</h3>
      </VChip>
    </VCol>
    <AppTable 
      class="student-skill-table"
      :headers="headers"
      :items="from_evaluation"
      :items-per-page="itemsPerPage"
      @click:row="onUpdate"
    >
      <template #item.skillProgress="{ item }">
        <VProgressCircular
          :size="35"
          :width="4"
          :model-value="item.raw.skillProgress"
          :color="helpers.resolver.getColor(item.raw.skillProgress)"
        >
          <span class="text-xs">{{ item.raw.skillProgress }}</span>
        </VProgressCircular>
      </template>

      <template #item.action="{ item }">
        <VBtn
          icon=""
          variant="text"
          size="small"
          color="error"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon 
            icon="tabler-trash"
          />
          <VTooltip activator="parent" >Delete Skill</VTooltip>
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <SkillModal ref="modalRef" />
</template>

<style>
/*
.student-skill-table > .v-table__wrapper > table {
  border-block-start: none !important;
}
*/

.student-skill-table .v-table__wrapper {
  border: none !important;
}

/*
.student-skill-table.v-table thead > tr > .v-data-table__td {
  border: none !important;
}
*/

.student-skill-table.v-table tbody .v-data-table__tr > .v-data-table__td {
  border: none !important;
}
</style>
