<template>
  <div id="app">
    <Login v-if="currentView === 'login'" @go-to-register="currentView = 'register'" />
    <Register v-else @go-to-login="currentView = 'login'" />
  </div>
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

export default {
  components: {
    Login,
    Register
  },
  data() {
    return {
      currentView: 'login'
    };
  }
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}
</style>