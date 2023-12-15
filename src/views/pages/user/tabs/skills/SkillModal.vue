<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import SkillService from '@/services/skill.service';
import useSkillStore from '@/stores/skill.store';
import { inject } from 'vue';

const skillService = new SkillService()
const skillStore = useSkillStore()
const authContext = inject("authContext")
const studentContext = inject("studentContext")
const modalRef = ref()
const form = ref({})
const formError = ref({
  SkillName: [],
  SkillDescription: [],
  SkillProgress: [],
  SkillAssessmentType: [],
})
const refVForm = ref()
const submitted = ref(false)
const toast = inject("toast")

defineExpose({
  open() {
    modalRef.value.open()
    skillStore.resetField()
    form.value = skillStore.getSkillModel
  },
  openAsUpdateMode(data) {
    skillStore.setField(data)
    form.value = skillStore.getSkillModel
    modalRef.value.openAsUpdateMode()
  },
  close() {
    modalRef.value.close()
    skillStore.resetField()
  },
})

async function submit() {
  if (refVForm.value.validate()) (!modalRef.value.isUpdateMode())? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await skillService.createSkill({
      ...(form.value),
      skillAssessmentType: (authContext.value.id == studentContext.value.userId) ? 0 : 1,
    })

    if (code == 200) {
      toast.success("Successfully created skill.")
      skillStore.add(response)
      modalRef.value.close()

      await reset()
    }
  } catch (err) {
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

async function update() {
  try
  {
    const { status: code, data: response } = await skillService.updateSkill(form.value.id, form.value)

    if (code == 200) {
      toast.success("Successfully updated skill.")
      skillStore.update(response)
      modalRef.value.close()

      await reset()
    }
  } catch (err) {
    console.log(err);
    formError.value = err.response?.data?.errors ?? formError.value
  }
}

// 👉 Reset
async function reset() {
  formError.value = ({
    SkillName: [],
    SkillDescription: [],
    SkillProgress: [],
    SkillAssessmentType: [],
  })
  await nextTick(() => { 
    refVForm.value.resetValidation()
    refVForm.value.reset()
  })
}

// 
</script>


<template>
  <AppModal 
    ref="modalRef"
    :max-width="430"
  >
    <template #title>
      Skill Details
    </template>
    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
        @submit.prevent="submit"
      >
        <VRow>
          <VCol cols="12">
            <span class="font-weight-bold text-sm">SKILL</span>
            <VTextField 
              v-model="form.skillName"
              :rules="[requiredValidator]"
            />
          </VCol> 
          <VCol cols="12">
            <span class="font-weight-bold text-sm">DESCRIPTION</span>
            <VTextarea
              v-model="form.skillDescription"
              auto-grow
              :rows="2"
              :max-rows="5"
              :rules="[requiredValidator]"
            />
          </VCol> 
          <VCol cols="12">
            <div class="d-flex flex-row flex-nowrap align-center justify-space-between">
              <span class="d-flex font-weight-bold text-sm">SKILL RATE</span>
              <span class="d-flex font-weight-bold text-sm">{{ form.skillProgress }}%</span>  
            </div>
            <VRadioGroup
              v-model="form.skillProgress"
              inline
            >
              <VRadio
                label="Poor"
                :value="0"
              />
              <VRadio
                label="Good"
                :value="25"
              />
              <VRadio
                label="Exceptional"
                :value="50"
              />
              <VRadio
                label="Excellent"
                :value="75"
              />
              <VRadio
                label="Proficient"
                :value="100"
              />  
            </VRadioGroup>
          </VCol>
          <VCol cols="12">
            <VBtn 
              block
              :color="(!modalRef.isUpdateMode()) ? 'success' : 'secondary'"
              type="submit"
            >
              <VIcon 
                start
                :icon="(!modalRef.isUpdateMode()) ? 'tabler-location' : 'tabler-edit'"
              />
              {{ (!modalRef.isUpdateMode()) ? 'CREATE' : 'UPDATE' }}
            </VBtn>  
          </VCol>
        </VRow>  
      </VForm>
    </template>
  </AppModal>
</template>
