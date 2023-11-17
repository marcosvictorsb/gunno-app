/* eslint-disable no-return-await */
import ApiService from './ApiService';

class TeamUserService {
  constructor() {
    this.api = ApiService;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async getByUser(iduser) {
    return await this.api.get(`/teamuser/${iduser}`);
  }

//   async created(params) {
//     return await this.api.post('/teamuser', params);
//   }

  async edit(payload) {
    return await this.api.put(`/teamuser`, payload);
  }
}

export default new TeamUserService();
