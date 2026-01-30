<!-- filepath: d:\MEVN\frontend\src\views\StudentDashboard.vue -->
<template>
  <div class="dashboard-wrapper">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="school-logo">
          <div class="logo-circle">HAU</div>
        </div>
        <div class="header-text">
          <h1>Holy Angel University</h1>
          <p>Student Portal Dashboard</p>
        </div>
      </div>
    </header>

    <!-- Main Dashboard Container -->
    <div class="dashboard-container">
      
      <!-- Loading State -->
      <div v-if="loading" class="loading">Loading dashboard...</div>

      <!-- Error State -->
      <div v-if="error" class="error-banner">
        {{ error }}
      </div>

      <!-- Welcome Banner -->
      <div v-if="!loading && student" class="welcome-banner">
        <h2>Welcome back, {{ student.name || 'Student' }}! 👋</h2>
        <p>Here's your dashboard overview</p>
      </div>

      <!-- Student Information Card -->
      <div v-if="!loading && student" class="info-card">
        <div class="card-header">
          <h3>📋 Student Information</h3>
        </div>
        
        <div class="card-body">
          <!-- Full Name -->
          <div class="info-item">
            <div class="info-label">
              <span class="icon">👤</span>
              <span>Full Name</span>
            </div>
            <div class="info-value">{{ student.name || 'Not provided' }}</div>
          </div>

          <!-- Student Number -->
          <div class="info-item">
            <div class="info-label">
              <span class="icon">🎓</span>
              <span>Student Number</span>
            </div>
            <div class="info-value">{{ student.studentNumber || 'Not provided' }}</div>
          </div>

          <!-- Email -->
          <div class="info-item">
            <div class="info-label">
              <span class="icon">✉️</span>
              <span>Email Address</span>
            </div>
            <div class="info-value">{{ student.email || 'Not provided' }}</div>
          </div>

          <!-- Account Status -->
          <div class="info-item">
            <div class="info-label">
              <span class="icon">✅</span>
              <span>Account Status</span>
            </div>
            <div class="info-value">
              <span class="status-badge active">Active</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Actions -->
      <div v-if="!loading && student" class="actions-section">
        <h3>Quick Actions</h3>
        
        <div class="action-cards">
          <!-- View Profile Card -->
          <div class="action-card">
            <div class="action-icon">👁️</div>
            <h4>View Profile</h4>
            <p>See your complete profile information</p>
            <button @click="viewProfile" class="btn-action btn-primary">View Profile</button>
          </div>

          <!-- Edit Profile Card -->
          <div class="action-card">
            <div class="action-icon">✏️</div>
            <h4>Edit Profile</h4>
            <p>Update your personal information</p>
            <button @click="editProfile" class="btn-action btn-secondary">Edit Profile</button>
          </div>

          <!-- Logout Card -->
          <div class="action-card">
            <div class="action-icon">🚪</div>
            <h4>Logout</h4>
            <p>Sign out from your account</p>
            <button @click="logout" class="btn-action btn-logout">Logout</button>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="dashboard-footer">
      <p>&copy; 2024 Holy Angel University. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'StudentDashboard',
  setup() {
    const router = useRouter();
    const student = ref(null);
    const loading = ref(true);
    const error = ref('');

    onMounted(() => {
      try {
        // Get student data from localStorage (set during login)
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          error.value = 'No user data found. Please login again.';
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        student.value = JSON.parse(userData);
        console.log('✅ Student data loaded:', student.value);
      } catch (err) {
        error.value = 'Failed to load profile';
        console.error('Error loading profile:', err);
      } finally {
        loading.value = false;
      }
    });

    const viewProfile = () => {
      console.log('Viewing profile...');
      alert('Profile view coming soon!');
    };

    const editProfile = () => {
      console.log('Editing profile...');
      alert('Profile edit coming soon!');
    };

    const logout = () => {
      console.log('Logging out...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    };

    return {
      student,
      loading,
      error,
      viewProfile,
      editProfile,
      logout
    };
  }
};
</script>

<style scoped>
/* ===== Global Dashboard Wrapper ===== */
.dashboard-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* ===== Header Section ===== */
.dashboard-header {
  background: linear-gradient(135deg, #830e2b 0%, #a61136 100%);
  color: white;
  padding: 20px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background-color: white;
  color: #830e2b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-text h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.header-text p {
  margin: 5px 0 0 0;
  font-size: 14px;
  opacity: 0.9;
}

/* ===== Main Dashboard Container ===== */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* ===== Welcome Banner ===== */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.welcome-banner h2 {
  margin: 0 0 8px 0;
  font-size: 26px;
}

.welcome-banner p {
  margin: 0;
  font-size: 15px;
  opacity: 0.95;
}

/* ===== Student Information Card ===== */
.info-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  overflow: hidden;
}

.card-header {
  background-color: #830e2b;
  color: white;
  padding: 20px 25px;
}

.card-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.card-body {
  padding: 25px;
}

/* Individual Info Item */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #555;
  font-size: 15px;
}

.icon {
  font-size: 20px;
}

.info-value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

/* Status Badge */
.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

/* ===== Actions Section ===== */
.actions-section {
  margin-top: 30px;
}

.actions-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 22px;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

/* Individual Action Card */
.action-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.action-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.action-card h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 20px;
}

.action-card p {
  color: #666;
  margin: 0 0 20px 0;
  font-size: 14px;
  line-height: 1.5;
}

/* Action Buttons */
.btn-action {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #830e2b;
  color: white;
}

.btn-primary:hover {
  background-color: #6a0b23;
  transform: scale(1.02);
}

.btn-secondary {
  background-color: #667eea;
  color: white;
}

.btn-secondary:hover {
  background-color: #5568d3;
  transform: scale(1.02);
}

.btn-logout {
  background-color: #dc3545;
  color: white;
}

.btn-logout:hover {
  background-color: #c82333;
  transform: scale(1.02);
}

/* ===== Footer ===== */
.dashboard-footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 40px;
}

.dashboard-footer p {
  margin: 0;
  font-size: 14px;
}

/* ===== Responsive Design ===== */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-text h1 {
    font-size: 22px;
  }

  .welcome-banner h2 {
    font-size: 22px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .action-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-container {
    padding: 20px 15px;
  }

  .logo-circle {
    width: 50px;
    height: 50px;
    font-size: 16px;
  }

  .header-text h1 {
    font-size: 20px;
  }

  .card-body {
    padding: 20px;
  }
}
</style>