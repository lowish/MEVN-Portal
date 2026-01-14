<template>
  <div class="page-wrapper">
    <div class="login-container">
      <!-- Left Section -->
      <div class="left-section">
        <div class="content">
          <img :src="logoUrl" alt="Holy Angel University Logo" class="logo" />
          <h1 class="university-name">Holy Angel University</h1>
          <p class="description">
            The campus is now online! You can still create your BEST MOMENTS at Holy Angel University by enjoying full access to all essential academic and non-academic and library resources.
          </p>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="login-card">
          <h2 class="login-title">User Login</h2>
          <form @submit.prevent="login">
            <div class="form-group">
              <input
                v-model="username"
                type="text"
                placeholder="user name"
                class="input-field"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="password"
                type="password"
                placeholder="password"
                class="input-field"
                required
              />
            </div>
            <button type="submit" class="login-button">Login</button>
          </form>
          <a href="#" class="register-link">Register</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logoUrl from '../assets/HAU.gif';

export default {
  name: 'Login',
  data() {
    return {
      logoUrl,
      username: '',
      password: ''
    };
  },
  methods: {
    login() {
      // Placeholder logic - will integrate backend later
      console.log('Login attempted with:', {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>
