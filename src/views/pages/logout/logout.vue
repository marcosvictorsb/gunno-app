<template>
  <div>
    <Loading :is-loading="isLoading" />
  </div>
</template>

<script>
import Loading from '../../../components/Loading/Loading.vue'

export default {
  name: 'Home',
  components: {
    Loading
  },
  data() {
    return {
      isLoading: false
    };
  },
  created() {
    this.isLoading = true;
    this.$store.commit('logout');
  },
  methods: {
    logout() {
      console.log('CHEGOU NO METODO');
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>
