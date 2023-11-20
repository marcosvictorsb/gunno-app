/* eslint-disable no-return-await */
import ApiService from './ApiService';

class ResultKeyService {
  constructor() {
    this.api = ApiService;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async created(payload) {
    return await this.api.post('/result-key', payload);
  }

//   async edit(payload) {
//     return await this.api.put(`/user`, payload);
//   }

//   async delete(id) {
//     return await this.api.delete(`/user/${id}`);
//   }
}

export default new ResultKeyService();