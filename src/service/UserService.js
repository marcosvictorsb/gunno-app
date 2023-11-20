/* eslint-disable no-return-await */
import ApiService from './ApiService';

class UserService {
  constructor() {
    this.api = ApiService;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async getAllUser(idcompany) {
    return await this.api.get(`/user`, { params: { idcompany } });
  }

  async created(payload) {
    return await this.api.post('/user', payload);
  }

  async edit(payload) {
    return await this.api.put(`/user`, payload);
  }

  async delete(id) {
    return await this.api.delete(`/user/${id}`);
  }

  async getById(id) {
    return await this.api.get(`/user/${id}`);
  }
}

export default new UserService();
