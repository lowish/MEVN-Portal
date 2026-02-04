<!-- filepath: d:\MEVN\frontend\src\views\StudentDashboard.vue -->
<template>
  <div class="page">
    <!-- Top Header Bar -->
    <header class="header-bar">
      <div class="header-left">
        <div class="hamburger">☰</div>
        <div class="logo">
          <img class="logo-img" :src="hauLogo" alt="HAU logo" />
        </div>
      </div>
      <div class="header-right">
        <div class="header-item">Policy</div>
        <div class="header-item">Help</div>
        <div class="header-item">Account ▼</div>
      </div>
    </header>

    <div class="body">
      <!-- Sidebar starts below header, fixed position -->
      <aside class="sidebar">
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
                <span class="last-name">Last Name ,</span><br>
                <span class="first-name">FIRST NAME</span><br>
                <span class="middle-name">MIDDLE NAME</span>
              </div>
            </div>
            <!-- Column 3: Details -->
            <div class="col-right">
              <div class="detail-row">
                <div class="label">Student Number</div>
                <div class="value">00000000</div>
              </div>
              <div class="detail-row">
                <div class="label">Gender</div>
                <div class="value">Male</div>
              </div>
              <div class="detail-row">
                <div class="label">Birth Date</div>
                <div class="value">July 02, 2007</div>
              </div>
              <div class="detail-row">
                <div class="label">Nationality</div>
                <div class="value">Filipino</div>
              </div>
              <div class="detail-row">
                <div class="label">Religion</div>
                <div class="value">Catholic</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import hauLogo from "../assets/HAU.gif";
</script>

<style scoped>
/* ===== Header Bar ===== */
.header-bar {
  width: 100%;
  height: 90px;
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
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* Hamburger in header */
.hamburger {
  font-size: 22px;
  cursor: pointer;
  user-select: none;
  padding: 8px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-circle {
  display: none;
}

.logo-img {
  height: 100px;
  max-height: 150px;
  width: auto;
  object-fit: contain;
}

/* ===== Global Dashboard Wrapper ===== */
.page {
  font-family: Arial, system-ui, sans-serif;
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
  margin-top: 64px; /* Push content below header */
}

/* ===== Sidebar ===== */
.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e5e5e5;
  min-height: calc(100vh - 64px);
  padding: 16px 12px 12px 12px;
  box-sizing: border-box;
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
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
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  font-weight: 700;
  font-size: 14px;
  color: #555;
  text-align: left;
  padding: 8px 0;
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
  margin-left: 260px; /* Sidebar width */
}

/* When sidebar is collapsed (UI only) */
.sidebar.collapsed ~ .content {
  margin-left: 72px;
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
}

.card-body {
  display: grid;
  grid-template-columns: 180px 1fr 1.2fr;
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
}

.student-name .last-name {
  font-size: 22px;
  font-weight: 700;
  text-transform: capitalize;
}

.student-name .first-name,
.student-name .middle-name {
  font-size: 22px;
  font-weight: 700;
  text-transform: uppercase;
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
  font-weight: 700;
  color: #222;
}

.value {
  font-weight: 400;
  color: #555;
}

/* ===== Responsive Design ===== */
@media (max-width: 900px) {
  .header-bar {
    flex-direction: column;
    height: auto;
    padding: 12px;
  }
  .body {
    flex-direction: column;
    margin-top: 64px;
  }
  .sidebar {
    position: static;
    width: 100%;
    min-height: auto;
    height: auto;
    left: 0;
    top: 0;
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
}
</style>