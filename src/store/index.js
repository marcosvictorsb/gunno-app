import { createStore } from 'vuex';

export default createStore({
  // estados existente no projeto
  state: {
    user: {
      admin: false,
      email: '',
      uuid: '',
      id: '',
      idcompany: '',
      name: '',
      token: '',
      isAuthenticated: false
    }
  },
  mutations: {
    // alterar os estatos acimas
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {},
  getters: {
    isAuthenticated() {
      return this.state.user.isAuthenticated;
    }
  }
});
