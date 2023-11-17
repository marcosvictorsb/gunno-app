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

  async getAllUser(idcompany, valeu=1) {
    return await this.api.get(`/user?page=${valeu}`, { params: { idcompany } });
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
}

export default new UserService();
