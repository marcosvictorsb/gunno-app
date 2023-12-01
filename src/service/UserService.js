import ApiService from './ApiService';
import store from '../store';

class UserService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async getAllUser(idcompany) {
    this.config.params = { idcompany };
    return await this.api.get(`/user`, this.config);
  }

  async created(payload) {
    return await this.api.post('/user', payload, this.config);
  }

  async edit(payload) {
    return await this.api.put(`/user`, payload, this.config);
  }

  async delete(id) {
    return await this.api.delete(`/user/${id}`, this.config);
  }

  async getById(id) {
    return await this.api.get(`/user/${id}`, this.config);
  }
}

export default new UserService();
