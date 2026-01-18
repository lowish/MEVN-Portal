<template>
  <div class="page-wrapper">
    <div class="register-container">
      <div class="register-card">
        <div class="card-header">
          <img :src="logoUrl" alt="SOC Logo" class="logo" />
          <h2 class="register-title">Student Registration</h2>
          <p class="register-subtitle">Create your Holy Angel University Portal Account</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form" novalidate>
          <!-- Full Name Field -->
          <div class="form-group">
            <label for="fullName" class="form-label">
              Full Name
              <span class="required">*</span>
            </label>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              placeholder="Enter your full name"
              class="input-field"
              :class="{ 'field-error-border': fieldErrors.fullName }"
              required
              @blur="validateField('fullName')"
              @input="validateField('fullName')"
            />
            <span v-if="fieldErrors.fullName" class="field-error">
              {{ fieldErrors.fullName }}
            </span>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email" class="form-label">
              Email Address
              <span class="required">*</span>
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="Enter your email (e.g., student@gmail.com)"
              class="input-field"
              :class="{ 'field-error-border': fieldErrors.email }"
              required
              @blur="validateField('email')"
              @input="validateField('email')"
            />
            <span v-if="fieldErrors.email" class="field-error">
              {{ fieldErrors.email }}
            </span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password" class="form-label">
              Password
              <span class="required">*</span>
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter a password (at least 6 characters)"
              class="input-field"
              :class="{ 'field-error-border': fieldErrors.password }"
              required
              @blur="validateField('password')"
              @input="validateField('password')"
            />
            <span v-if="fieldErrors.password" class="field-error">
              {{ fieldErrors.password }}
            </span>
            <p v-if="!fieldErrors.password" class="field-hint">
              💡 Password must be at least 6 characters long
            </p>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">
              Confirm Password
              <span class="required">*</span>
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              class="input-field"
              :class="{ 'field-error-border': fieldErrors.confirmPassword }"
              required
              @blur="validateField('confirmPassword')"
              @input="validateField('confirmPassword')"
            />
            <span v-if="fieldErrors.confirmPassword" class="field-error">
              {{ fieldErrors.confirmPassword }}
            </span>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-error">
            <span class="alert-icon">⚠️</span>
            <div class="alert-content">
              <p>{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="alert alert-success">
            <span class="alert-icon">✅</span>
            <div class="alert-content">
              <p>{{ successMessage }}</p>
              <div v-if="registrationData" class="credentials-display">
                <h4>Your Login Credentials:</h4>
                <p class="credential-item">
                  <strong>Student Number:</strong>
                  <code class="credential-code">{{ registrationData.studentNumber }}</code>
                  <button 
                    type="button" 
                    class="copy-btn" 
                    @click="copyToClipboard(registrationData.studentNumber)"
                    title="Copy to clipboard"
                  >
                    <FontAwesomeIcon :icon="['fas', 'clipboard']" />
                  </button>
                </p>
                <p class="warning-text">
                  <FontAwesomeIcon :icon="['fas', 'triangle-exclamation']" />
                  Please save your student number. Redirecting to login in <strong>{{ redirectCountdown }}</strong> seconds...
                </p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="register-button"
            :disabled="loading || isFormInvalid"
            :class="{ 'is-loading': loading }"
          >
            <span v-if="!loading">Register Now</span>
            <span v-else class="button-loading">
              <span class="spinner"></span>
              <span>Registering...</span>
            </span>
          </button>

          <!-- Terms -->
          <p class="terms-text">
            By registering, you agree to our
            <a href="#" title="Terms of Service">Terms of Service</a> and
            <a href="#" title="Privacy Policy">Privacy Policy</a>
          </p>
        </form>

        <div class="card-footer">
          <p>
            Already have an account?
            <a 
              href="#" 
              @click.prevent="$emit('go-to-login')" 
              class="login-link"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import logoUrl from '../assets/SOC.png';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClipboard, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(faClipboard, faTriangleExclamation);

// API Configuration
const API_URL = 'http://localhost:5000';
const REGISTER_ENDPOINT = `${API_URL}/api/register`;

// Set axios defaults
axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default {
  name: 'Register',
  components: {
    FontAwesomeIcon
  },
  emits: ['go-to-login'],
  data() {
    return {
      logoUrl,
      formData: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      fieldErrors: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      loading: false,
      errorMessage: '',
      successMessage: '',
      registrationData: null,
      redirectCountdown: 5,
      countdownInterval: null
    };
  },
  computed: {
    isFormInvalid() {
      return (
        !this.formData.fullName.trim() ||
        !this.formData.email.trim() ||
        !this.formData.password ||
        !this.formData.confirmPassword ||
        Object.values(this.fieldErrors).some(error => error !== '')
      );
    }
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  },
  methods: {
    validateField(fieldName) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      switch (fieldName) {
        case 'fullName':
          if (!this.formData.fullName.trim()) {
            this.fieldErrors.fullName = 'Full name is required';
          } else if (this.formData.fullName.trim().length < 3) {
            this.fieldErrors.fullName = 'Full name must be at least 3 characters';
          } else {
            this.fieldErrors.fullName = '';
          }
          break;

        case 'email':
          if (!this.formData.email.trim()) {
            this.fieldErrors.email = 'Email is required';
          } else if (!emailRegex.test(this.formData.email)) {
            this.fieldErrors.email = 'Please enter a valid email address';
          } else {
            this.fieldErrors.email = '';
          }
          break;

        case 'password':
          if (!this.formData.password) {
            this.fieldErrors.password = 'Password is required';
          } else if (this.formData.password.length < 6) {
            this.fieldErrors.password = 'Password must be at least 6 characters';
          } else {
            this.fieldErrors.password = '';
          }
          if (this.formData.confirmPassword) {
            this.validateField('confirmPassword');
          }
          break;

        case 'confirmPassword':
          if (!this.formData.confirmPassword) {
            this.fieldErrors.confirmPassword = 'Please confirm your password';
          } else if (this.formData.password !== this.formData.confirmPassword) {
            this.fieldErrors.confirmPassword = 'Passwords do not match';
          } else {
            this.fieldErrors.confirmPassword = '';
          }
          break;
      }
    },

    validateForm() {
      this.validateField('fullName');
      this.validateField('email');
      this.validateField('password');
      this.validateField('confirmPassword');

      return !Object.values(this.fieldErrors).some(error => error !== '');
    },

    async handleRegister() {
      this.errorMessage = '';
      this.successMessage = '';
      this.registrationData = null;

      // Validate form
      if (!this.validateForm()) {
        this.errorMessage = 'Please fix the errors above before submitting.';
        return;
      }

      // Check if password fields match
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.loading = true;

      // Create clean payload
      const registrationPayload = {
        name: this.formData.fullName.trim(),
        email: this.formData.email.trim().toLowerCase(),
        password: this.formData.password
      };

      console.log('📝 [REGISTER] Submitting registration request');
      console.log('🔗 [REGISTER] Endpoint:', REGISTER_ENDPOINT);
      console.log('📦 [REGISTER] Payload:', {
        name: registrationPayload.name,
        email: registrationPayload.email,
        password: '***' // Hide password in logs
      });

      try {
        // Make POST request with explicit configuration
        const response = await axios({
          method: 'POST',
          url: REGISTER_ENDPOINT,
          data: registrationPayload,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ [REGISTER] Registration successful');
        console.log('📥 [REGISTER] Response:', response.data);

        this.successMessage = response.data.message;
        this.registrationData = response.data.data;

        // Reset form
        this.formData = {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

        // Reset field errors
        this.fieldErrors = {
          fullName: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

        // Start countdown and redirect
        this.startRedirectCountdown();

      } catch (error) {
        console.error('❌ [REGISTER] Registration failed');
        console.error('🔍 [REGISTER] Full error:', error);

        if (error.response) {
          // Backend returned an error
          console.error('📤 [REGISTER] Response status:', error.response.status);
          console.error('📤 [REGISTER] Response data:', error.response.data);
          this.errorMessage = error.response.data.message || 'Registration failed. Please try again.';
        } else if (error.request) {
          // Request was made but no response
          console.error('🌐 [REGISTER] No response from server');
          console.error('🌐 [REGISTER] Request:', error.request);
          this.errorMessage = 
            'Cannot connect to server. Please check:\n' +
            '• Backend is running on http://localhost:5000\n' +
            '• MongoDB is running\n' +
            '• No firewall blocking the connection';
        } else {
          // Something else happened
          console.error('⚡ [REGISTER] Error:', error.message);
          this.errorMessage = error.message || 'An unexpected error occurred.';
        }
      } finally {
        this.loading = false;
      }
    },

    //Registration successful countdown / Countdown of Student number
    startRedirectCountdown() {
      this.redirectCountdown = 60;

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }

      this.countdownInterval = setInterval(() => {
        this.redirectCountdown--;
        console.log(`🔄 [REGISTER] Redirecting in ${this.redirectCountdown} seconds...`);

        if (this.redirectCountdown <= 0) {
          clearInterval(this.countdownInterval);
          console.log('🎯 [REGISTER] Redirecting to login page');
          this.$emit('go-to-login');
        }
      }, 1000);
    },

    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          console.log('📋 [REGISTER] Copied to clipboard:', text);
        }).catch(err => {
          console.error('Failed to copy:', err);
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('📋 [REGISTER] Copied to clipboard:', text);
      }
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
  background: #f9f9f9;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.register-card {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 40px;
}

.card-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  object-fit: contain;
}

.register-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c2c2c;
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 0.95rem;
  color: #737373;
}

.register-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c2c2c;
  margin-bottom: 8px;
  text-align: left;
}

.required {
  color: #dc2626;
}

.optional {
  color: #6b7280;
  font-weight: 400;
  font-size: 0.85rem;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: #ffffff;
  color: #333;
  transition: all 0.3s ease;
  font-family: inherit;
}

.input-field:focus {
  outline: none;
  border-color: #830e2b;
  box-shadow: 0 0 0 3px rgba(131, 14, 43, 0.1);
}

.input-field.field-error-border {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.input-field.field-error-border:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

select.input-field {
  cursor: pointer;
}

.field-error {
  display: block;
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 4px;
}

.field-hint {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 4px;
}

.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.alert-icon {
  flex-shrink: 0;
  font-size: 1.2rem;
}

.alert-content {
  flex: 1;
}

.alert-error {
  background: #fee;
  border: 1px solid #fca5a5;
  color: #dc2626;
}

.alert-success {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #166534;
}

.credentials-display {
  background: #fff;
  padding: 15px;
  margin-top: 15px;
  border-radius: 4px;
  border: 2px solid #830e2b;
}

.credentials-display h4 {
  margin-bottom: 12px;
  color: #830e2b;
  font-size: 0.95rem;
}

.credential-item {
  margin: 10px 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: #830e2b;
}

.credential-code {
  background: #f3f4f6;
  padding: 4px 8px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  user-select: all;
}

.copy-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
  color: #830e2b;
}

.copy-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.warning-text {
  margin-top: 12px;
  font-size: 0.85rem;
  color: #c33;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
}

.warning-text svg {
  width: 16px;
  height: 16px;
}

.register-button {
  width: 100%;
  padding: 13px 24px;
  margin-top: 10px;
  background: #830e2b;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-button:hover:not(:disabled) {
  background: #6a0a22;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(131, 14, 43, 0.2);
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.terms-text {
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  margin-top: 15px;
}

.terms-text a {
  color: #830e2b;
  text-decoration: none;
  font-weight: 500;
}

.terms-text a:hover {
  text-decoration: underline;
}

.card-footer {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.card-footer p {
  font-size: 0.9rem;
  color: #6b7280;
}

.login-link {
  color: #830e2b;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.login-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
