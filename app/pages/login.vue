<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-3xl font-bold mb-4">Login Page</h1>
    <form @submit.prevent="login" class="flex flex-col gap-4 w-80">
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="p-2 border border-gray-300 rounded"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="p-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        class="p-2 bg-blue-500 text-white rounded"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref(null)
const isLoading = ref(false)
const router = useRouter()

const login = async () => {
  if (!username.value || !password.value) return

  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // ذخیره توکن برای استفاده در داشبورد
    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  } catch (e) {
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* استایل‌های ساده */
</style>
