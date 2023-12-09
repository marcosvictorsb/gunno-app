<template></template>

<script>
export default {
  name: 'Home',
  data() {
    return {};
  },
  created() {
    console.log('Logout');
    this.$store.commit('logout');
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>
