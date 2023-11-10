<!-- eslint-disable vue/custom-event-name-casing -->
<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: "tabler-question-mark",
  },
  label: {
    type: String,
    default: "label",
  },
  color: {
    type: String,
    color: "success",
  },
})

const emit = defineEmits([
  "click",
])

const { y } = useWindowScroll()

// 👉 Button ref
const btnRef = ref()

// 👉 Default buttom
const defaultBottom = ref("5%")

async function onClick() {
  emit("click")
}

// 👉 Watch scroll
watch(y, value => {
  if (!btnRef.value) return

  if (value > 200)
  {
    // 5% := default bottom, 38 := button height, 5 := gap
    btnRef.value.$el.nextElementSibling.style["insetBlockEnd"] = `calc(5% + ${38 + 5}px)`
  } 
  else if (value <= 200)
  {
    btnRef.value.$el.nextElementSibling.style["insetBlockEnd"] = defaultBottom.value
  }
}, { deep: true })

// 
</script>


<template>
  <VBtn
    ref="btnRef"
    class="fab-activator-btn"
    variant="elevated"
    :color="props.color"
    icon=""
    density="comfortable"
    @click="onClick"
  >
    <VTooltip activator="parent">
      {{ props.label }}
    </VTooltip>

    <VIcon
      :icon="props.icon"
      size="22"
    />
  </VBtn>
</template>

<style lang="scss">
.fab-activator-btn {
  position: fixed !important;
  z-index: 999;
  inset-block-end: 5%;
  inset-inline-end: 25px;
}
</style>
