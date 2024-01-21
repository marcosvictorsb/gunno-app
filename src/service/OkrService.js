import ApiService from './ApiService';
import store from '../store';

class OkrService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async getObjectiveByQuarter(quarter, idcompany) {
    this.config.params = { idcompany };
    return await this.api.get(`/objectives/${quarter}`, this.config);
  }

  async created(payload) {
    return await this.api.post('/objectives', payload, this.config);
  }

  //   async edit(payload) {
  //     return await this.api.put(`/user`, payload, this.config);
  //   }

  async delete(id) {
    return await this.api.delete(`/objectives/${id}`, this.config);
  }

  async getAllYears(idcompany) {
    return await this.api.get(`/objectives/company/${idcompany}/years`, this.config);
  }

  async getObjectiveByFilters(options) {
    this.config.params = null;
    this.config.params = { ...options };
    return await this.api.get('/objectives/filter', this.config);
  }
}

export default new OkrService();
