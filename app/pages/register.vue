<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <input 
        v-model="name" 
        type="text" 
        placeholder="Full Name" 
        required 
      />
      <input 
        v-model="email" 
        type="email" 
        placeholder="Email" 
        required 
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required 
      />
      <input 
        v-model="confirmPassword" 
        type="password" 
        placeholder="Confirm Password" 
        required 
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }

  console.log('Registering with', {
    name: name.value,
    email: email.value,
    password: password.value,
  })
}
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.register-page form {
  display: flex;
  flex-direction: column;
}
.register-page input {
  margin: 0.5rem 0;
  padding: 0.6rem;
}
.register-page button {
  margin-top: 1rem;
  padding: 0.7rem;
  background: #333;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
