<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    if (this.$route.path === '/') {
      this.$router.replace('/login');
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