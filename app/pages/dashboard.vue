<template>
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard!</p>

    <!-- ناوبری بین زیرصفحه‌ها -->
    <nav class="mb-4 flex gap-4">
      <NuxtLink to="/dashboard/image-convert" class="text-blue-500">Image Converter</NuxtLink>
      <NuxtLink to="/dashboard/pdf" class="text-blue-500">PDF Converter</NuxtLink>
    </nav>

    <button @click="logout">Logout</button>

    <!-- رندر کردن صفحات داخلی -->
    <NuxtPage />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()

// بررسی توکن در localStorage هنگام بارگذاری صفحه
onMounted(() => {
  const token = localStorage.getItem('token')
  // اگر توکن وجود نداشت و کاربر در صفحه‌ی تبدیل تصویر نبود، او را به لاگین بفرست
  if (!token && router.currentRoute.value.path !== '/dashboard/image-convert') {
    router.push('/login')
  }
})

const logout = () => {
  localStorage.removeItem('token') // حذف توکن
  router.push('/login') // هدایت به صفحه لاگین
}
</script>

<style scoped>
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #c0392b;
}
nav a {
  text-decoration: underline;
}
</style>
