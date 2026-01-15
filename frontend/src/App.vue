<template>
  <div id="app">
    <Login v-if="currentView === 'login'" @go-to-register="currentView = 'register'" />
    <Register v-else @go-to-login="currentView = 'login'" />
  </div>
</template>

<script>
import axios from "axios";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";

export default {
  components: {
    Login,
    Register
  },
  data() {
    return {
      currentView: 'login',
      users: []
    };
  },
  methods: {
    async getUsers() {
      try {
        const res = await axios.get("http://localhost:5000/users"); // call backend API
        this.users = res.data; // save data to display in frontend
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style>
#app {
  margin: 0;
  padding: 0;
}
</style>