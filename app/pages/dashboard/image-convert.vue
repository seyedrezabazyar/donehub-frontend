<template>
  <div>
    <h1>Image Converter</h1>
    <form @submit.prevent="convertImage">
      <div>
        <label for="image">Select Image:</label>
        <input type="file" id="image" @change="handleFileUpload" accept="image/*" />
      </div>
      <div>
        <label for="format">Convert to:</label>
        <select id="format" v-model="selectedFormat">
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Converting...' : 'Convert' }}
      </button>
    </form>

    <div v-if="isLoading" class="loading">
      Converting, please wait...
    </div>

    <div v-if="error" class="error">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-if="convertedImageUrl" class="result">
      <h2>Conversion Successful!</h2>
      <img :src="convertedImageUrl" alt="Converted Image" />
      <div>
        <a :href="convertedImageUrl" :download="`converted-image.${selectedFormat}`">
          Download Image
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedFile = ref(null);
const selectedFormat = ref('png');
const isLoading = ref(false);
const convertedImageUrl = ref(null);
const error = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  convertedImageUrl.value = null; // Reset previous result
  error.value = null; // Reset previous error
};

const convertImage = async () => {
  if (!selectedFile.value) {
    alert('Please select an image first.');
    return;
  }

  isLoading.value = true;
  convertedImageUrl.value = null;
  error.value = null;

  const formData = new FormData();
  formData.append('image', selectedFile.value);
  formData.append('format', selectedFormat.value);

  try {
    // IMPORTANT: Make sure your Laravel backend is running on this address
    // and that CORS is configured to allow requests from your Nuxt app's origin.
    const response = await fetch('http://127.0.0.1:8000/api/image/convert', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json, image/*', // Accept JSON for errors, and image for success
      },
    });

    if (!response.ok) {
      // Try to parse error message from JSON response
      const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred.' }));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    const imageBlob = await response.blob();
    convertedImageUrl.value = URL.createObjectURL(imageBlob);

  } catch (e) {
    console.error('Error during image conversion:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
div {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
form {
  margin-top: 20px;
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