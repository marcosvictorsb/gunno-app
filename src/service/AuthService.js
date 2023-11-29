/* eslint-disable no-return-await */
import ApiService from './ApiService';

class AuthService {
  constructor() {
    this.api = ApiService;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async auth(email, password) {
    const payload = { email, password };
    return await this.api.post(`/authenticate`, payload);
  }
}

export default new AuthService();