<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-lg p-6">
      <h1 class="text-2xl font-bold text-center mb-6 text-blue-600">🎯 Date Converter</h1>

      <form @submit.prevent="convertDate" class="space-y-5">
        <!-- انتخاب تقویم ورودی -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">From Calendar:</label>
          <select v-model="fromCalendar" class="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option value="gregorian">📅 Gregorian</option>
            <option value="jalali">🌸 Jalali</option>
            <option value="hijri">🌙 Hijri</option>
          </select>
        </div>

        <!-- وارد کردن تاریخ دستی -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">Enter a Date:</label>
          <input
            type="text"
            v-model="inputDate"
            placeholder="e.g. 12/02/1401 or 2025-10-15"
            class="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <p class="text-gray-500 text-sm mt-1">You can type date in Jalali, Gregorian, or Hijri formats.</p>
        </div>

        <!-- انتخاب تقویم خروجی -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">To Calendar:</label>
          <select v-model="toCalendar" class="w-full border border-gray-300 rounded-xl p-3 text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none">
            <option value="gregorian">📅 Gregorian</option>
            <option value="jalali">🌸 Jalali</option>
            <option value="hijri">🌙 Hijri</option>
          </select>
        </div>

        <button type="submit" :disabled="isLoading" class="w-full py-3 text-white font-semibold rounded-xl transition-all duration-200" 
                :class="isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'">
          {{ isLoading ? 'Converting...' : 'Convert Date' }}
        </button>
      </form>

      <!-- نمایش نتیجه -->
      <transition name="fade">
        <div v-if="result" class="mt-6 text-center bg-green-50 border border-green-300 rounded-xl p-4 animate-fade-in">
          <p class="text-gray-700 font-medium">{{ result.direction }}</p>
          <p class="text-2xl font-bold text-green-700 mt-2">{{ result.output }}</p>
        </div>
      </transition>

      <!-- نمایش خطا -->
      <transition name="fade">
        <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>
      </transition>
    </div>

    <p class="text-gray-500 text-sm mt-6">Made with ❤️ for everyone</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputDate = ref('')
const fromCalendar = ref('gregorian')
const toCalendar = ref('jalali')
const result = ref(null)
const isLoading = ref(false)
const error = ref(null)

// تابع ساده برای پاکسازی و تبدیل فرمت‌های معمولی به yyyy-mm-dd
function normalizeDate(input) {
  // جایگزین کردن / با -
  return input.replace(/\//g, '-')
}

const convertDate = async () => {
  if (!inputDate.value.trim()) {
    error.value = 'Please enter a date 🌸'
    return
  }

  isLoading.value = true
  error.value = null
  result.value = null

  try {
    const normalizedDate = normalizeDate(inputDate.value)

    const params = new URLSearchParams({
      date: normalizedDate,
      from: fromCalendar.value,
      to: toCalendar.value
    })

    const response = await fetch(`http://127.0.0.1:8000/convert-date?${params.toString()}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    if (!data.success) throw new Error(data.message || 'Conversion failed')

    result.value = data
  } catch (e) {
    console.error(e)
    error.value = e.message || 'Something went wrong 😢'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>
