/* eslint-disable no-return-await */
import ApiService from './ApiService';

class OkrService {
  constructor() {
    this.api = ApiService;
    this.options = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  async getObjectiveByQuarter(quarter, idcompany) {
    return await this.api.get(`/objectives/${quarter}`, { params: { idcompany } });
  }

  async created(payload) {
    return await this.api.post('/objectives', payload);
  }

//   async edit(payload) {
//     return await this.api.put(`/user`, payload);
//   }

//   async delete(id) {
//     return await this.api.delete(`/user/${id}`);
//   }
}

export default new OkrService();
