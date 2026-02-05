<!-- filepath: d:\MEVN\frontend\src\views\StudentDashboard.vue -->
<template>
  <div class="page">
    <!-- Top Header Bar -->
    <header class="header-bar">
      <div class="header-left">
        <div class="hamburger" @click="toggleSidebar" aria-label="Toggle sidebar">
          <span class="burger-bar"></span>
          <span class="burger-bar"></span>
          <span class="burger-bar"></span>
        </div>
        <div class="logo">
          <img class="logo-img" :src="hauLogo" alt="HAU logo" />
        </div>
      </div>
      <div class="header-right">
        <div class="header-item">Policy</div>
        <div class="header-item">Help</div>
        <div class="header-item account-dropdown" ref="accountDropdownRef">
          <div class="account-toggle" @click="toggleAccountMenu">Account ▼</div>
          <div v-if="showAccountMenu" class="account-menu">
            <div class="account-menu-item" @click="viewProfile">View Profile</div>
            <div class="account-menu-item" @click="logout">Logout</div>
          </div>
        </div>
      </div>
    </header>

    <div class="body">
      <!-- Sidebar starts below header, fixed position -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-top">
          <input class="search" type="text" placeholder="Search" />
        </div>
        <nav class="menu">
          <div class="menu-item">Accounts Receivable</div>
          <div class="menu-item active">Student Information</div>
          <div class="menu-item">Enrollment Support</div>
          <div class="menu-item">Student Services</div>
          <div class="menu-item">Student Performance</div>
          <div class="menu-item">Library Support</div>
          <div class="menu-item">Question / Contribution Management</div>
          <div class="menu-item">Utilities</div>
        </nav>
      </aside>

      <main class="content">
        <section class="card">
          <div class="card-header">Basic Student Information</div>
          <div class="card-body">
            <!-- Column 1: Avatar -->
            <div class="col-left">
              <div class="avatar"></div>
            </div>
            <!-- Column 2: Name -->
            <div class="col-center">
              <div class="student-name">
                <span class="last-name">{{ student.lastName }} ,</span><br>
                <span class="first-name">{{ student.firstName }}</span>
                <template v-if="student.middleName">
                  <br>
                  <span class="middle-name">{{ student.middleName }}</span>
                </template>
              </div>
            </div>
            <!-- Vertical Divider -->
            <div class="divider"></div>
            <!-- Column 3: Details -->
            <div class="col-right">
              <div class="detail-row">
                <div class="label">Student Number:</div>
                <div class="value">{{ student.studentNumber }}</div>
              </div>
              <div class="detail-row">
                <div class="label">Gender:</div>
                <div class="value">{{ student.gender }}</div>
              </div>
              <div class="detail-row">
                <div class="label">Birth Date</div>
                <div class="value">{{ student.birthDate }}</div>
              </div>
              <div class="detail-row">
                <div class="label">Nationality:</div>
                <div class="value">{{ student.nationality }}</div>
              </div>
              <div class="detail-row">
                <div class="label">Religion:</div>
                <div class="value">{{ student.religion }}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import hauLogo from "../assets/dashboardlogo.png";

const router = useRouter();

// Account dropdown toggle
const showAccountMenu = ref(false);
const accountDropdownRef = ref(null);

// Sidebar toggle
const sidebarCollapsed = ref(false);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value;
};

const closeAccountMenu = () => {
  showAccountMenu.value = false;
};

const viewProfile = () => {
  console.log("View Profile clicked");
  closeAccountMenu();
  // router.push("/profile");
};

const logout = () => {
  console.log("Logout clicked");
  closeAccountMenu();

  // Clear authentication data
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("registrationData");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");

  // Redirect to login page
  router.push("/login");
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (accountDropdownRef.value && !accountDropdownRef.value.contains(event.target)) {
    closeAccountMenu();
  }
};

// Parse full name into last, first, middle name
const parseFullName = (fullName) => {
  if (!fullName) {
    return { lastName: "", firstName: "", middleName: "" };
  }

  const nameParts = fullName.trim().split(/\s+/);
  if (nameParts.length === 1) {
    return { lastName: nameParts[0], firstName: "", middleName: "" };
  }

  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const middleName = nameParts.slice(1, -1).join(" ");

  return { lastName, firstName, middleName };
};

// Initialize student data from localStorage or registration
const student = ref({
  lastName: "Doe",
  firstName: "John",
  middleName: "Smith",
  studentNumber: "00000001",
  gender: "Male",
  birthDate: "July 02, 2007",
  nationality: "Filipino",
  religion: "Catholic",
});

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  
  // Fetch student data from localStorage (set during registration)
  const registrationData = localStorage.getItem("registrationData");
  
  console.log('📂 [DASHBOARD] Checking for registration data...');
  
  if (registrationData) {
    try {
      const parsedData = JSON.parse(registrationData);
      console.log('✅ [DASHBOARD] Registration data found:', parsedData);
      
      // Parse full name
      const nameParts = parseFullName(parsedData.fullName || "");
      
      // Generate student number if not provided
      const studentNumber = parsedData.studentNumber || 
                           localStorage.getItem("studentNumber") ||
                           `HAU${Date.now().toString().slice(-8)}`;
      
      student.value = {
        lastName: nameParts.lastName || "Not provided",
        firstName: nameParts.firstName || "Not provided",
        middleName: nameParts.middleName || "",
        studentNumber: studentNumber,
        gender: parsedData.gender || "Not specified",
        birthDate: parsedData.birthDate || "Not specified",
        nationality: parsedData.nationality || "Filipino",
        religion: parsedData.religion || "Not specified",
      };

      console.log('📊 [DASHBOARD] Student data loaded:', student.value);
    } catch (error) {
      console.error("❌ [DASHBOARD] Error parsing registration data:", error);
    }
  } else {
    console.warn('⚠️ [DASHBOARD] No registration data found in localStorage');
  }
});

onUnmounted(() => {
  document.removeEventListener("click",clickOutside);
});
</script>

<style scoped>
/* ===== Header Bar ===== */
.header-bar {
  width: 100%;
  height: 100px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 0 24px;
  box-sizing: border-box;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.header-item {
  font-size: 15px;
  color: #555;
  cursor: pointer;
}

.hamburger {
  cursor: pointer;
  user-select: none;
  padding: 15px 10px;
  margin: 15px 0;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: slategrey;
}

.hamburger:hover {
  color: #000;
}

.burger-bar {
  width: 26px;
  height: 4px;
  background: currentColor;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-circle {
  display: none;
}

.logo-img {
  margin-top: 20px;
  height: 100px;
  max-height: 100px;
  width: 240px;
  object-fit: contain;
}

/* Account Dropdown */
.account-dropdown {
  position: relative;
}

.account-toggle {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  user-select: none;
}

.account-toggle:hover {
  background-color: #f5f5f5;
}

.account-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.account-menu-item {
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.account-menu-item:hover {
  background-color: #f5f5f5;
}

.account-menu-item:first-child {
  border-bottom: 1px solid #eee;
}

/* ===== Global Dashboard Wrapper ===== */
.page {
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  background: #eee;
  min-height: 100vh;
  color: #000;
}

/* Remove old topbar */
.topbar {
  display: none;
}

.body {
  display: flex;
  margin-top: 90px;
}

/* ===== Sidebar ===== */
.sidebar {
  width: 310px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  min-height: calc(100vh - 90px);
  padding: 16px 12px 12px 12px;
  box-sizing: border-box;
  position: fixed;
  top: 90px;
  left: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 90px);
  overflow-y: auto;
  transition: width 0.3s ease, margin-left 0.3s ease;
}

.sidebar.collapsed {
  width: 0;
  padding: 0;
  border-right: none;
  overflow: hidden;
}

.sidebar.collapsed .menu-item {
  font-size: 0;
}

.sidebar.collapsed .search {
  display: none;
}

.sidebar-top {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search {
  padding: 8px;
  border: 1px solid #cfcfcf;
  font-size: 14px;
  border-radius: 4px;
  margin-bottom: 18px;
  transition: opacity 0.3s ease;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  font-weight: bold;
  font-size: 15px;
  color: #000000;
  text-align: left;
  padding: 6px 0;
  cursor: pointer;
  transition: color 0.2s ease;
  font-family: Tahoma, Arial, Verdana, 'Luxi Sans', Helvetica;
}

.menu-item:hover {
  color: #333;
}

.menu-item.active {
  color: #000;
}

/* Sidebar collapsed (UI only, no logic) */
.sidebar.collapsed {
  width: 72px;
}
.sidebar.collapsed .menu-item {
  font-size: 0;
  padding: 8px 0;
}
.sidebar.collapsed .search {
  display: none;
}

/* ===== Main Content ===== */
.content {
  flex: 1;
  padding: 18px 20px;
  background: #eee;
  margin-left: 260px;
  margin-top: 0;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .content {
  margin-left: 0;
}

/* ===== Card & Student Info ===== */
.card {
  width: 100%;
  background: #fff;
  border: 1px solid #dcdcdc;
  box-sizing: border-box;
  margin-top: 25px;
}

.card-header {
  background: #333;
  color: #fff;
  padding: 20px 50px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.5px;
  text-align: left;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.card-body {
  display: grid;
  grid-template-columns: 180px 1fr auto 1.2fr;
  gap: 24px;
  padding: 24px;
  align-items: center;
}

.col-left {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  background: #ccc;
  border: 1px solid #bdbdbd;
  border-radius: 50%;
  display: block;
}

.col-center {
  min-height: 120px;
  display: flex;
  align-items: center;
}

.student-name {
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3;
  color: #222;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.student-name .last-name {
  font-size: 40px;
  font-weight: bold;
  text-transform: capitalize;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.student-name .first-name,
.student-name .middle-name {
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  padding-right: 10px;
}

.col-right {
  min-height: 120px;
  display: grid;
  gap: 10px;
}

.detail-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
  font-size: 16px;
  align-items: center;
}

.label {
  font-weight: 500;
  color: #222;
  font-size: 15px;
}

.value {
  font-weight: 700;
  color: gray;
  font-size: 14px;
}

/* ===== Divider ===== */
.divider {
  width: 1px;
  height: 160px;
  margin: 0 12px;
  border-left: 2px solid #aaa;
}

/* ===== Responsive Design ===== */
@media (max-width: 900px) {
  .header-bar {
    height: auto;
    flex-wrap: wrap;
    padding: 12px;
  }

  .body {
    flex-direction: column;
    margin-top: 90px;
  }

  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
    height: auto;
    top: auto;
    border-right: none;
    border-bottom: 1px solid #e5e5e5;
  }

  .content {
    margin-left: 0;
    padding: 12px;
  }

  .card-body {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .student-details {
    border-left: 0;
    padding-left: 0;
  }

  .account-menu {
    right: auto;
    left: 0;
  }
}
</style>