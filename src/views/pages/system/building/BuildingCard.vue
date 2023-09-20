<script setup>
import { useThemeConfig } from "@/@core/composable/useThemeConfig"
import { helpers } from '@/helpers'
import useBuildingStore from "@/stores/building.store"
import { useRouter } from 'vue-router'

const props = defineProps({
  buildingId: {
    type: [Number, null],
    required: true,
  },
  buildingNumber: {
    type: Number,
    default: 0,
  },
  buildingName: {
    type: String,
    default: "My Building",
  },
  buildingShortName: {
    type: String,
    default: "My-Building-Short-Name",
  },
  buildingDescription: {
    type: String,
    default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
})

const emit = defineEmits([
  "click:edit",
  "click:view",
])

const buildingStore = useBuildingStore()

// 👉 Router
const router = useRouter()

// 👉 theme
const theme = useThemeConfig()

const computedBg = computed(() => {

  return theme.theme.value == "dark"
    ? "rgb(var(--v-theme-surface))"
    : "#fff" 
})

// 👉 Computed name
const computedName = computed(() => { 
  let append = ""

  if (props.buildingName.length >= 22) {
    append = "..."
  }

  return props.buildingName.substring(0, 22) + append
})

// 👉 Computed description
const computedDesc = computed(() => { 
  let append = ""

  if (props.buildingDescription.length >= 100) {
    append = "..."
  }

  return props.buildingDescription.substring(0, 100) + append
})

// 👉 Computed Data
const computedData = computed(() => { 
  return props.buildingId
})

// 👉 Handle click
async function handleClick() {
  emit("click:view", computedData.value)
  localStorage.setItem("selectedBuilding", JSON.stringify(buildingStore.getBuildings.find(d => d.id == props.buildingId)))

  router.push({
    name: 'system-schools-id-campuses-campusid-buildings-buildingid-rooms',
    params: {
      buildingid: helpers.security.encrypt(props.buildingId),
    },
    props: true,
  })
}

//
</script>

<template>
  <VCard class="building-card w-100 h-100">
    <div
      class="building-card__image-container"
      :style="`background-color: ${computedBg};`"
    />

    <VCardText>
      <div class="d-flex flex-row flex-nowrap mb-3">
        <VBtn
          rounded="sm"
          variant="tonal"
          icon=""
          size="small"
          color="warning"
        >
          <span class="text-sm">#{{ props.buildingNumber }}</span>
        </VBtn>
        <div class="ms-2">
          <h3 class="font-weight-thin text-uppercase">
            {{ computedName }}
          </h3>
          <span class="d-block v-block text-xs text-disabled">{{ props.buildingShortName }}</span>
        </div>
      </div>
      <VDivider />
      <p class="font-weight-thin text-sm">
        {{ computedDesc }}
      </p>
    </VCardText>
    <div class="building-card-action-btn demo-space-x flex-row flex-nowrap">
      <VBtn
        color="success"
        variant="elevated"
        size="small"
        @click.stop.prevent="emit('click:edit', computedData)"
      >
        <span>EDIT</span>
        <VIcon
          end
          icon="tabler-edit"
        />
      </VBtn>
      <VBtn
        color="primary"
        variant="tonal"
        size="small"
        @click.stop.prevent="handleClick"
      >
        <span>VIEW</span>
        <VIcon
          end
          icon="tabler-eye"
        />
      </VBtn>
    </div>
  </VCard>
</template>

<style lang="scss">
    .building-card {
      // position: relative;
      // background: url("/home/andy404/Projects/CQI-vuexy/src/assets/images/illustrations/3d-building.jpg") !important;
      // background-size: 30% !important;
      // background-repeat: no-repeat !important;
      // background-color: #4ACCEC !important;
      padding-block-end: 30px;
    }

    .building-card__image-container {
      position: absolute !important;
      z-index: -1;
      block-size: 100% !important;
      inline-size: 100%;
      inset-block-start: 0 !important;
      inset-inline-start: 0 !important;
    }

    .building-card-action-btn {
      position: absolute;
      inset-block-end: 24px;
      inset-inline-start: 24px;
    }
</style>
