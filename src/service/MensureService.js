/* eslint-disable no-return-await */
import ApiService from './ApiService';
import store from '../store';

class MensureService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async save(payload) {
    return await this.api.post('/mensure', payload, this.config);
  }
}

export default new MensureService();
