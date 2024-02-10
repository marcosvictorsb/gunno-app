import ApiService from './ApiService';
import store from '../store';

class DashboardService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async getAmountOKR(idcompany) {
    this.config.params = { idcompany };
    return await this.api.get(`/amount/okr`, this.config);
  }

  async getAmountResultKeys(idcompany) {
    this.config.params = { idcompany };
    return await this.api.get(`/amount/result-keys`, this.config);
  }
}

export default new DashboardService();
