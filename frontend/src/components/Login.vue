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
                v-model="loginData.studentNumber"
                type="text"
                placeholder="username..."
                class="input-field user-field"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="loginData.password"
                type="password"
                placeholder="password"
                class="input-field password-field"
                required
              />
            </div>
            <button type="submit" :disabled="loading" class="login-button">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <!-- Error/Success Message -->
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>

          <div class="register-link">
            <a href="#" @click.prevent="goToRegister">Register</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import logoUrl from '../assets/HAU.gif';

export default {
  name: 'Login',
  emits: ['go-to-register'],
  data() {
    return {
      logoUrl,
      loginData: {
        studentNumber: '',
        password: ''
      },
      loading: false,
      message: '',
      messageType: ''
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        this.message = '';
        this.messageType = '';

        console.log('=== Login Attempt ===');
        console.log('Student Number:', this.loginData.studentNumber);

        // Validate inputs
        if (!this.loginData.studentNumber || !this.loginData.password) {
          this.message = 'Please enter student number and password';
          this.messageType = 'error';
          return;
        }

        const payload = {
          studentNumber: this.loginData.studentNumber.trim(),
          password: this.loginData.password.trim(),
        };
        
        console.log('Sending payload:', payload);

        // Call backend API
        const response = await axios.post('http://localhost:5000/api/auth/login', payload);
        console.log('Response:', response.data);

        if (response.data.success) {
          console.log('✅ Login successful');

          // Store JWT token
          localStorage.setItem('token', response.data.token);
          
          // Store user info
          localStorage.setItem('user', JSON.stringify(response.data.data));

          this.message = 'Login successful! Redirecting...';
          this.messageType = 'success';

          this.$router.push('/dashboard');
        }

      } catch (error) {
        console.error('❌ Login error:', error);

        if (error.response) {
          // Server responded with error
          this.message = error.response.data.message || 'Login failed';
        } else if (error.request) {
          // No response from server
          this.message = 'Cannot connect to server. Please check if backend is running.';
        } else {
          // Other errors
          this.message = 'An error occurred. Please try again.';
        }
        
        this.messageType = 'error';

      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      this.$router.push('/register');
    }
  }
};
</script>

<!--Styling-->
<style>
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
  overflow: hidden;
}

/* Left Section */
.left-section {
  flex: 7;
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
  width: 330px;
  height: 230px;
  margin-bottom: 20px;
  object-fit: contain;
}

.university-name {
  font-size: 2rem;
  font-weight: bold;
  color: #2c2c2c;
  margin-bottom: 15px;
  letter-spacing: -0.5px;
  line-height: 1.2;
  unicode-bidi: isolate;
}

.description {
  font-size: 0.85rem;
  color: #737373;
  line-height: 1.6;
  font-weight: 400;
}

/* Right Section */
.right-section {
  flex: 3;
  background: #710e1d;
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
  font-size: 1.17rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 25px;
  text-align: left;
  margin-left: 20px;
}

.form-group {
  margin-bottom: 15px;
  position: relative;
}

.input-field {
  width: 155px;
  padding: 10px 10px 10px 28px;
  border: none;
  border-radius: 7px;
  font-size: 0.9rem;
  background: #ffffff;
  color: #333;
  transition: all 0.3s ease;
  background-repeat: no-repeat;
  background-position: 5px center;
  background-size: 15px 15px;
}

.input-field::placeholder {
  color: #847c7c;
  font-size: 13px;
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
  width: 70px;
  padding: 10px 15px;
  margin-bottom: 22px;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.5s ease;
  text-transform: capitalize;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-button:hover {
  background: #f8f8f8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-button:active {
  transform: translateY(0);
}

.message {
  margin: 15px 0;
  padding: 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  text-align: center;
}

.message.success {
  background-color: rgba(212, 237, 218, 0.3);
  color: #ffffff;
  border: 1px solid rgba(195, 230, 203, 0.5);
}

.message.error {
  background-color: rgba(248, 215, 218, 0.3);
  color: #ffffff;
  border: 1px solid rgba(245, 198, 203, 0.5);
}

.register-link {
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
  font-weight: 300;
  color: #ffffff;
}

.register-link a {
  color: #ffffff;
  text-decoration: none;
}

.register-link a:hover {
  color: #ffffff;
}

.register-link:hover {
  opacity: 0.85;
  color: #ffffff;
}

</style>