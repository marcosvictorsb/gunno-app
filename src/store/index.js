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
    }
  },
  actions: {},
  getters: {
    isAuthenticated: (state) => {
      return !!state.user.token;
    }
  }
});
