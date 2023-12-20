/* eslint-disable no-return-await */
import ApiService from './ApiService';
import store from '../store';

class PlannerService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async getPlannerCurrentYear(year, idcompany) {
    return await this.api.get(`/planner/year/${year}/company/${idcompany}`, this.config);
  }

  async created(params) {
    return await this.api.post('/planner', params, this.config);
  }

//   async edit(payload) {
//     return await this.api.put(`/teamuser`, payload, this.config);
//   }
}

export default new PlannerService();
