import ApiService from './ApiService';
import store from '../store';

class ResultKeyService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async created(payload) {
    return await this.api.post('/result-key', payload, this.config);
  }

  async edit(idResultKey, payload) {
    return await this.api.put(`/result-key/${idResultKey}`, payload, this.config);
  }

  async delete(id) {
    return await this.api.delete(`/result-key/${id}`, this.config);
  }

//   async delete(id) {
//     return await this.api.delete(`/user/${id}`);
//   }
}

export default new ResultKeyService();