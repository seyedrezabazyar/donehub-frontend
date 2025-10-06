<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-8">Welcome to Donehub</h1>
    <div class="space-x-4">
      <NuxtLink to="/login" class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Login
      </NuxtLink>
      <NuxtLink to="/register" class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Register
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// نیازی به کد جاوااسکریپت نیست
</script>

<style scoped>
/* استایل‌های اضافی اگه لازم شد */
</style>