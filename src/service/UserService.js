/* eslint-disable no-return-await */
import ApiService from './ApiService';
import store from '../store';

class UserService {
  constructor() {
    this.api = ApiService;
  }

  async getAllUser(idcompany) {
    // const data = { params: { idcompany } };
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${store.state.user.token}`
    //   }
    // };

    const options = {
      params: { idcompany },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };

    return await this.api.get('/user', options);
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
