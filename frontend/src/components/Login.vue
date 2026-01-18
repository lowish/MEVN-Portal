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
                class="input-field user-field"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="password"
                type="password"
                placeholder="password"
                class="input-field password-field"
                required
              />
            </div>
            <button type="submit" class="login-button">Login</button>
          </form>
          <div class="register-link">
            <a href="#" @click.prevent="$emit('go-to-register')">Register</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import logoUrl from '../assets/HAU.gif';

export default {
  name: 'Login',
  emits: ['go-to-register'],
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

<style scoped>
.page-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}

.login-container {
  display: flex;
  width: 780px;
  height: 450px;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  overflow: hidden;
  border-radius: 8px;
}

/* Left Section */
.left-section {
  flex: 0 0 70%;
  background-image: radial-gradient(#eee 40%, #ddd 65%, #bbb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 50px;
}

.content {
  text-align: center;
  max-width: 100%;
}

.logo {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  object-fit: contain;
}

.university-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.description {
  font-size: 0.85rem;
  color: #737373;
  line-height: 1.6;
  font-weight: 400;
}

/* Right Section */
.right-section {
  flex: 0 0 30%;
  background: #830e2b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
}

.login-card {
  width: 100%;
  max-width: 100%;
  text-align: center;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 30px;
  text-align: left;
}

.form-group {
  margin-bottom: 15px;
  position: relative;
}

.input-field {
  width: 100%;
  padding: 12px 12px 12px 35px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  background: #ffffff;
  color: #333;
  transition: all 0.3s ease;
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 16px 16px;
}

.input-field::placeholder {
  color: #aaa;
}

.input-field:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.user-field {
  background-image: url('../assets/user.png');
}

.password-field {
  background-image: url('../assets/key.png');
}

.login-button {
  width: 100%;
  padding: 12px 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  background: #ffffff;
  color: #830e2b;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: capitalize;
}

.login-button:hover {
  background: #f8f8f8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  transform: translateY(0);
}

.register-link {
  text-align: center;
  margin-top: 15px;
  font-size: 0.95rem;
}

.register-link a {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.register-link a:hover {
  opacity: 0.85;
  text-decoration: underline;
}
</style>