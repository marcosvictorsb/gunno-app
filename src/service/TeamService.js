/* eslint-disable no-return-await */
import ApiService from './ApiService';
import store from '../store';

class TeamService {
  constructor() {
    this.api = ApiService;
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.state.user.token}`
      }
    };
  }

  async getTeams(idcompany) {
    this.config.params = { idcompany };
    return await this.api.get(`/team`, this.config);
  }

  async getAllTeamsByID(idTeam) {
    return await this.api.get(`/team/${idTeam}`, this.config);
  }

  async created(name, idcompany) {
    const data = { name, idcompany };
    return await this.api.post('/team', data, this.config);
  }

  async updateNameTeam(id, name) {
    const data = { name };
    return await this.api.put(`/team/${id}`, data, this.config);
  }

  async deleteTeam(id) {
    return await this.api.delete(`/team/${id}`, this.config);
  }
}

export default new TeamService();
