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
      <div class="header-center">
        <span class="portal-title">Portal Main Menu</span>
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
        <div class="dashboard-grid">
          <!-- Left Column: Student Information -->
          <div class="left-column">
            <section class="card">
              <div class="card-header">Basic Student Information</div>
              <div class="card-body">
                <!-- Column 1: Avatar -->
                <div class="col-left">
                  <img class="avatar" :src="studentPfp" alt="Student Avatar" />
                </div>
                <!-- Column 2: Name -->
                <div class="col-center">
                  <div class="student-name" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
                    <span class="last-name">{{ student.lastName }} ,</span><br>
                    <span class="first-name">{{ student.firstName }}</span>
                    <template v-if="student.middleName">
                      <span v-if="sidebarCollapsed"> </span><br v-else>
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

            <section class="card schedule-card">
              <div class="card-header">Class Schedule</div>
              <div class="schedule-body">
                <div class="schedule-top">
                  <span class="schedule-label">Class Schedule for:</span>
                  <span class="schedule-term">SY 2025-2026, 1st / 2nd term</span>
                </div>
                <div class="schedule-empty">No class schedule</div>
              </div>
            </section>
          </div>

          <!-- Right Column: Calendar and Account Security -->
          <div class="right-column">
            <!-- Account Security Information -->
            <section class="card security-card">
              <div class="card-header">Account Security Information</div>
              <div class="card-body security-body">
                <!-- Empty for now as per requirements -->
              </div>
            </section>

            <!-- Calendar -->
            <section class="card calendar-card">
              <div class="calendar-header">
                <button class="calendar-nav" @click="previousMonth">←</button>
                <span class="calendar-title">{{ currentMonthYear }}</span>
                <button class="calendar-nav" @click="nextMonth">→</button>
              </div>
              <div class="calendar-grid">
                <div class="calendar-day-header sunday">Sun</div>
                <div class="calendar-day-header">Mon</div>
                <div class="calendar-day-header">Tue</div>
                <div class="calendar-day-header">Wed</div>
                <div class="calendar-day-header">Thu</div>
                <div class="calendar-day-header">Fri</div>
                <div class="calendar-day-header">Sat</div>
                <div
                  v-for="day in calendarDays"
                  :key="day.key"
                  :class="
                    'calendar-day',
                    { 'empty': !day.date },
                    { 'sunday': day.isSunday },
                    { 'today': day.isToday }
                  "
                >
                  {{ day.date }}
                </div>
              </div>
              <div class="calendar-footer">
                <div class="event-title">Event(s) for Today</div>
                <div class="event-content">No event(s)</div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>

    <footer class="page-footer" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      All rights reserved, © 2020 DATAMOBILITY Corporation Philippines. Unit 1103, 11th Floor, Galleria Corporate Center, EDSA cor. Ortigas Ave. Ugong Norte Quezon City Telephone: (02) 914-2960
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import hauLogo from "../assets/dashboardlogo.png";
import studentPfp from "../assets/studentpfp.png";

const router = useRouter();

const showAccountMenu = ref(false);
const accountDropdownRef = ref(null);
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
};

const logout = () => {
  console.log("Logout clicked");
  closeAccountMenu();
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  localStorage.removeItem("registrationData");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");
  router.push("/login");
};

const handleClickOutside = (event) => {
  if (accountDropdownRef.value && !accountDropdownRef.value.contains(event.target)) {
    closeAccountMenu();
  }
};

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

const currentDate = ref(new Date());

const currentMonthYear = computed(() => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[currentDate.value.getMonth()]} ${currentDate.value.getFullYear()}`;
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push({ key: `empty-${i}`, date: null, isSunday: false, isToday: false });
  }
  for (let date = 1; date <= daysInMonth; date++) {
    const dayOfWeek = new Date(year, month, date).getDay();
    days.push({
      key: `day-${date}`,
      date,
      isSunday: dayOfWeek === 0,
      isToday: isCurrentMonth && date === today.getDate(),
    });
  }
  return days;
});

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const loadStudentFromStorage = () => {
  const registrationDataRaw = localStorage.getItem("registrationData");
  const userDataRaw = localStorage.getItem("user");
  const sourceRaw = registrationDataRaw || userDataRaw;

  if (!sourceRaw) {
    console.warn("⚠️ [DASHBOARD] No registration/user data found in localStorage");
    return;
  }

  try {
    const parsedData = JSON.parse(sourceRaw);
    const nameParts = parseFullName(parsedData.fullName || parsedData.name || "");
    const studentNumber =
      parsedData.studentNumber ||
      localStorage.getItem("studentNumber") ||
      `HAU${Date.now().toString().slice(-8)}`;

    student.value = {
      lastName: nameParts.lastName || "Not provided",
      firstName: nameParts.firstName || "Not provided",
      middleName: nameParts.middleName || "",
      studentNumber,
      gender: parsedData.gender || "Not specified",
      birthDate: parsedData.birthDate || "Not specified",
      nationality: parsedData.nationality || "Filipino",
      religion: parsedData.religion || "Not specified",
    };

    console.log("📊 [DASHBOARD] Student data loaded:", student.value);
  } catch (error) {
    console.error("❌ [DASHBOARD] Error parsing stored data:", error);
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  loadStudentFromStorage();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.header-bar {
  width: 100%;
  height: 105px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  padding: 0 30px;
  box-sizing: border-box;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 7px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.portal-title {
  font-size: 2rem;
  font-weight: normal;
  font-family: roboto;
  color: #222;
  padding-right: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 68px;
}

.header-item {
  font-size: 15px;
  font-weight: 300;
  cursor: pointer;
  color: black;
  font-family: Tahoma, Arial, Verdana, 'Luxi Sans', Helvetica;
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

.logo-img {
  margin-top: 20px;
  height: 100px;
  max-height: 100px;
  width: 240px;
  object-fit: contain;
}

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

.page {
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  background: #eee;
  min-height: 100vh;
  color: #000;
  padding-bottom: 52px;
}

.body {
  display: flex;
  margin-top: 90px;
}

.sidebar {
  width: 310px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  min-height: calc(100vh - 90px);
  padding: 16px 12px 12px 12px;
  box-sizing: border-box;
  position: fixed;
  top: 95px;
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
  gap: 20px;
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

.content {
  flex: 1;
  padding: 15px 25px;
  background: #eee;
  margin-left: 310px;
  margin-top: 0;
  transition: margin-left 0.3s ease;
}

.sidebar.collapsed ~ .content {
  margin-left: 0;
}

.card {
  width: 100%;
  background: #fff;
  border: 1px solid #dcdcdc;
  box-sizing: border-box;
  margin-top: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #333;
  color: #fff;
  padding: 7px 18px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.5px;
  text-align: left;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.card-body {
  display: grid;
  grid-template-columns: 180px 1fr auto 1.2fr;
  padding: 20px;
  align-items: center;
}

.col-left {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.avatar {
  width: 100%;
  height: 100%;
  max-width: 160px;
  max-height: 160px;
  margin-right: auto;
  background: #ccc;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
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
  line-height: 1.2;
  color: #222;
  margin-left: 15px;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.student-name .last-name {
  font-size: 40px;
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  line-height: 0.9;
  margin-bottom: -25px;
}
.student-name .first-name{
  font-size: 21px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  padding-right: 120px;
}

.student-name .middle-name {
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  padding-right: 4px;
  display: flex;
}

.student-name.sidebar-collapsed .first-name,
.student-name.sidebar-collapsed .middle-name {
  display: inline-flex;
  align-items: center;
  padding-right: 4px;
}

.col-right {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
}

.label {
  font-weight: 500;
  color: #222;
  font-size: 14px;
  width: 140px;
  display: flex;
}

.value {
  font-weight: 600;
  color: gray;
  font-size: 14px;
}

.divider {
  width: 1px;
  height: 160px;
  margin: 0 12px;
  border-left: 2px solid #aaa;
  padding-right: 15px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 275px;
  gap: 20px;
}

.left-column {
  width: 100%;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 280px;
}

.security-card {
  min-height: 80px;
}

.security-body {
  padding: 10px;
  min-height: 30px;
}

.calendar-card {
  border: 1px solid #dcdcdc;
  background: #fff;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px;
  background: #333;
  color: #fff;
}

.calendar-title {
  font-size: 15px;
  font-weight: 400;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.calendar-nav {
  background: none;
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
  font-weight: bold;
}

.calendar-nav:hover {
  opacity: 0.7;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #fff;
  gap: 0;
}

.calendar-day-header {
  text-align: center;
  font-weight: normal;
  font-size: 13px;
  padding: 5px 5px;
  color: #0066cc;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  border: 1px solid #e0e0e0;
  background: #f9f9f9;
}

.calendar-day-header.sunday {
  color: #cc0000;
}

.calendar-day {
  text-align: center;
  padding: 6px 6px;
  font-size: 13px;
  color: #000000;
  font-weight: 500;
  min-height: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-family: Tahoma, Arial, sans-serif;
}

.calendar-day.empty {
  visibility: hidden;
}

.calendar-day.sunday {
  color: #cc0000;
}

.calendar-day.today {
  background: #0066cc;
  color: #fff;
  font-weight: bold;
}

.calendar-footer {
  background: #fff;
  color: #000;
  padding: 0;
  border: 1px solid #bfbfbf;
  border-top: none;
}

.event-title {
  font-size: 13px;
  margin: 0;
  padding: 8px 12px;
  background: #333;
  color: #fff;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.event-content {
  font-size: 14px;
  color: #000;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
  padding: 8px 12px;
  background: #fff;
  border-top: 1px solid #bfbfbf;
  display: flex;
}

.schedule-card {
  margin-top: 15px;
}

.schedule-body {
  padding: 16px 20px 14px;
  background: #fff;
}

.schedule-top {
  display: flex;
  gap: 70px;
  font-size: 13px;
  color: #222;
  margin-bottom: 20px;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.schedule-label {
  min-width: 160px;
  text-align: left;
}

.schedule-term {
  font-weight: 600;
  color: #aaa;
  font-family: "Century Gothic", CenturyGothic, AppleGothic, sans-serif;
}

.schedule-empty {
  text-align: center;
  font-size: 14px;
  color: #333;
  padding: 80px 0;
  border-top: 1px solid #dcdcdc;
  font-family: Tahoma, Arial, sans-serif;
}

.page-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  background: #333;
  color: #aaa;
  text-align: center;
  padding: 20px 24px 25px;
  font-size: 8pt;
  line-height: normal;
  font-family: Tahoma, Arial, sans-serif;
  margin-left: 310px;
  transition: margin-left 0.3s ease;
}

.page-footer.sidebar-collapsed {
  margin-left: 0;
}

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
  .account-menu {
    right: auto;
    left: 0;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .right-column {
    order: 2;
  }
  .divider {
    display: none;
  }
}
</style>