import { createStore } from 'vuex';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || { token: null }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
      const channel = new BroadcastChannel('auth');
      channel.postMessage('login');
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');

      const channel = new BroadcastChannel('auth');
      channel.postMessage('logout');
      window.location.href = '/login';
    },
    resetState(state) {
      state.user = { token: null }; // Redefine o estado para o valor inicial
      localStorage.removeItem('user');
    }
  },
  actions: {},
  getters: {
    isAuthenticated: (state) => {
      return !!state.user.token;
    }
  }
});
