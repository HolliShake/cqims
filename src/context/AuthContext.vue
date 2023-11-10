<script setup>
import { onMounted, provide, reactive } from 'vue'

// 👉 Auth data
const authContext = reactive({
  
})

// 👉 Pass to children
provide("authContext", authContext)

onMounted(async () => {
  // Fetch auth data
})

// 
</script>

<template>
  <slot />
</template>
