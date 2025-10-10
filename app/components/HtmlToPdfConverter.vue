<template>
  <div class="container">
    <h1>HTML to PDF Converter</h1>

    <form @submit.prevent="convertPdf">
      <div>
        <label for="htmlFile">Select HTML File:</label>
        <input
          id="htmlFile"
          type="file"
          accept=".html"
          @change="handleFileChange"
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Converting...' : 'Convert to PDF' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFile = ref(null)
const isLoading = ref(false)
const error = ref(null)

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
  error.value = null
}

const convertPdf = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select an HTML file first.'
    return
  }

  isLoading.value = true
  error.value = null

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await fetch('http://127.0.0.1:8000/api/pdf/convert', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // اسم فایل رو از فایل HTML بسازیم
    const htmlName = selectedFile.value.name.replace(/\.[^/.]+$/, '')
    link.download = `${htmlName}.pdf`

    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error(e)
    error.value = e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
input[type="file"] {
  display: block;
  margin-top: 10px;
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 20px;
}
</style>
