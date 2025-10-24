<template>
<div class="container">
<h1>🖼️ Image Converter</h1>

<form @submit.prevent="convertImage">
<div>
<label for="image">Select Image:</label>
<input
type="file"
id="image"
@change="handleFileUpload"
accept="image/*"
required
/>
</div>

<div>
<label for="format">Convert to:</label>
<select id="format" v-model="selectedFormat">
<option value="png">PNG</option>
<option value="jpg">JPG</option>
<option value="webp">WEBP</option>
</select>
</div>

<button type="submit" :disabled="isLoading || !selectedFile">
{{ isLoading ? 'Converting...' : 'Convert' }}
</button>
</form>

<div v-if="isLoading" class="loading">
⏳ Converting, please wait...
</div>

<div v-if="error" class="error">
<strong>Error:</strong> {{ error }}
</div>

<div v-if="convertedImageUrl" class="result">
<h2>✅ Conversion Successful!</h2>
<img :src="convertedImageUrl" alt="Converted Image" />
<div>
<a :href="convertedImageUrl" :download="getDownloadFilename()">
Download Image
</a>
</div>
</div>
</div>
</template>

<script setup>
import { ref, watch } from 'vue'

const selectedFile = ref(null)
const selectedFormat = ref('jpg')
const isLoading = ref(false)
const convertedImageUrl = ref(null)
const error = ref(null)

// Clean up the previous object URL to prevent memory leaks
watch(convertedImageUrl, (newUrl, oldUrl) => {
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl)
  }
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    convertedImageUrl.value = null // Reset previous result
    error.value = null // Reset previous error
  }
}

const convertImage = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select an image file first.'
    return
  }

  isLoading.value = true
  convertedImageUrl.value = null
  error.value = null

  const formData = new FormData()
  formData.append('image', selectedFile.value)
  formData.append('format', selectedFormat.value)

  try {
    // Call our Nuxt server route (the proxy)
    const blob = await $fetch('/api/image/convert', {
      method: 'POST',
      body: formData,
      responseType: 'blob', // We expect the image blob back
    })

    // Create a URL for the blob to display in <img> and for the download link
    convertedImageUrl.value = URL.createObjectURL(blob)

  } catch (e) {
    console.error('Conversion Error:', e)
    // Try to parse a meaningful error message from the response
    const responseError = e.data?.statusMessage || e.message
    error.value = responseError || 'An unexpected error occurred during conversion.'

  } finally {
    isLoading.value = false
  }
}

const getDownloadFilename = () => {
    if (!selectedFile.value) return `converted-image.${selectedFormat.value}`;
    // Get the original filename without the extension
    const originalName = selectedFile.value.name.split('.').slice(0, -1).join('.');
    return `${originalName}-converted.${selectedFormat.value}`;
}
</script>

<style scoped>
.container {
max-width: 500px;
margin: 30px auto;
padding: 20px;
font-family: sans-serif;
}

h1 {
text-align: center;
margin-bottom: 20px;
}

form {
display: flex;
flex-direction: column;
gap: 15px;
}

label {
font-weight: bold;
}

input[type="file"], select, button {
padding: 10px;
border-radius: 5px;
border: 1px solid #ccc;
font-size: 1rem;
}

button {
background-color: #007bff;
color: white;
cursor: pointer;
border: none;
}

button:disabled {
background-color: #aaa;
cursor: not-allowed;
}

.loading, .error, .result {
margin-top: 25px;
padding: 15px;
border-radius: 5px;
}

.loading {
background-color: #eef;
}

.error {
color: #721c24;
background-color: #f8d7da;
border: 1px solid #f5c6cb;
}

.result {
background-color: #f0fff0;
border: 1px solid #cce5cc;
text-align: center;
}

.result img {
max-width: 100%;
margin-top: 10px;
border: 1px solid #ddd;
border-radius: 4px;
}

.result a {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.result a:hover {
  background-color: #218838;
}
</style>
