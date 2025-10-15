<template>
  <div class="p-6 max-w-md mx-auto bg-white rounded-2xl shadow">
    <h1 class="text-2xl font-bold mb-4">Slug Converter</h1>

    <!-- ورودی متن -->
    <div class="mb-4">
      <label class="block text-sm font-medium mb-1" for="text">متن اصلی:</label>
      <input
        id="text"
        v-model="text"
        type="text"
        class="w-full border border-gray-300 rounded-lg p-2"
        placeholder="مثلاً: سلام نوکرتم گلللللللللللللللل"
      />
    </div>

    <!-- دکمه تبدیل -->
    <button
      @click="convertToSlug"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
    >
      Convert
    </button>

    <!-- خروجی slug -->
    <div v-if="slug" class="mt-4 bg-gray-100 p-3 rounded-lg">
      <p class="text-sm text-gray-700">Slug:</p>
      <p class="font-mono break-all">{{ slug }}</p>
    </div>

    <!-- خطا -->
    <div v-if="error" class="mt-4 text-red-600 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const slug = ref('')
const error = ref('')

const convertToSlug = async () => {
  slug.value = ''
  error.value = ''

  if (!text.value.trim()) {
    error.value = 'لطفاً متنی وارد کن'
    return
  }

  try {
    const response = await $fetch('http://127.0.0.1:8000/api/v1/sluggenerators', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: { text: text.value },
    })

    slug.value = response.slug
  } catch (err) {
    error.value = 'خطا در ارتباط با سرور یا ساختار پاسخ نادرست است.'
    console.error(err)
  }
}
</script>

<style scoped>
body {
  direction: rtl;
}
</style>
