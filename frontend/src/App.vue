<template>
  <div id="app">
    <Login />
  </div>
</template>

<script>
import axios from "axios";
import Login from "./components/Login.vue";

export default {
  components: {
    Login
  },
  data() {
    return {
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