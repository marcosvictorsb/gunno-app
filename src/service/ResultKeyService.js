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

  async edit(idResultKey, payload) {
    return await this.api.put(`/result-key/${idResultKey}`, payload);
  }

  async delete(id) {
    return await this.api.delete(`/result-key/${id}`);
  }

//   async delete(id) {
//     return await this.api.delete(`/user/${id}`);
//   }
}

export default new ResultKeyService();