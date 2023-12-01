/* eslint-disable no-return-await */
import ApiService from './ApiService';
import store from '../store';

class TeamUserService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async getByUser(iduser) {
    return await this.api.get(`/teamuser/${iduser}`, this.config);
  }

  async created(params) {
    return await this.api.post('/teamuser', params, this.config);
  }

  async edit(payload) {
    return await this.api.put(`/teamuser`, payload, this.config);
  }
}

export default new TeamUserService();
