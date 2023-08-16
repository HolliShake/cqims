<script setup>
import Auth from "@/services/auth.service"
import useAuthStore from '@/stores/auth.store'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { useAbility } from "@casl/vue"
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { useRouter } from "vue-router"

// 👉 Router
const router = useRouter()

// 👉 Ability
const abilityStore =  useAbility()

// 👉 Auth service
const authentication = new Auth()

// 👉 Store
const authStore = useAuthStore()

// 👉 Toast
const toast = inject("toast")

const isPasswordVisible = ref(false)
const refVForm = ref()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref(null)

const iserror = computed(() => !!errorMessage.value)

async function onLogin(e) {
  if (!(await refVForm.value.validate())) return

  try {
    const response = await authentication.login({ email: email.value, password: password.value })

    if (response.status === 200)
    {
      // Save credentials
      authStore.setCredential(response.data)

      /**
       * // 👉 Set ability
       * abilityStore.update(response.data.userAbilities)
       **/

      // Push to main
      router.push({
        name: 'index',
      })
    } else {
      ;(toast.error(response.response?.data ?? "Invalid credentials"))
    }
    
  } catch (err) {
    ;(toast.error(err.message))
    ;(errorMessage.value = err.response?.data)
  }
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      cols="12"
      lg="4"
      offset="0"
      offset-lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard :max-width="450">
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 mb-1">
            Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h5>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        

        <VCardText>
          <!-- 👉 alert -->
          <VAlert
            v-if="iserror"
            variant="tonal"
            color="error"
            closable
            close-label="Close Alert"
          >
            <span>{{ errorMessage }}</span>
          </VAlert>
        
          <VForm
            ref="refVForm"
            @submit.prevent="onLogin"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  autofocus
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>

                <a
                  class="text-primary ms-2"
                  href="#"
                >
                  Create an account
                </a>
              </VCol>

              <VCol
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />

                <span class="mx-4">or</span>

                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
