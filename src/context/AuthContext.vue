<script setup>
import axiosIns from '@/plugins/axios';
import useAuthStore from '@/stores/auth.store';
import { inject, onMounted, provide } from 'vue';

const authStore = useAuthStore()

// 👉 Auth data
const authContext = computed(() => {
  return authStore.getCredential
})
const toast = inject("toast")

// 👉 Pass to children
provide("authContext", authContext)

onMounted(async () => {
  // Fetch auth data
  try
  {
    const { status: code, data: response } = await axiosIns.get("/Core/Auth/Me")

    if (code == 200) {
      authStore.setCredential(response)
    }
  } catch (err) {
    toast.error("Failed to fetch user data.")
  }
})

// 
</script>

<template>
  <slot />
</template>
