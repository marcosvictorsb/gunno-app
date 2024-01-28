import ApiService from './ApiService';
import store from '../store';

class ConfigService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async save(config) {
    return await this.api.post('/config', config, this.config);
  }

  async update(idcompany, config) {
    return await this.api.put(`/config/company/${idcompany}`, config, this.config);
  }

  async getByIdCompany(id) {
    return await this.api.get(`/config/company/${id}`, this.config);
  }
}

export default new ConfigService();
