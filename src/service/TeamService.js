/* eslint-disable no-return-await */
import ApiService from './ApiService';

class TeamService {
  constructor() {
    this.api = ApiService;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  async getTeams(idcompany) {
    const data = { idcompany };
    return await this.api.get(`/team`, { params: data });
  }

  async getAllTeamsByID(idTeam) {
    return await this.api.get(`/team/${idTeam}`);
  }

//   async created(team, idcompany) {
//     const data = { name: team, idcompany};
//     return await this.api.post('/team', data);
//   }

//   async updateNameTeam(id, name) {
//     const data = { name };
//     return await this.api.put(`/team/${id}`, data);
//   }

//   async deleteTeam(id) {
//     return await this.api.delete(`/team/${id}`);
//   }

//   async getAllTeams(idcompany){
//     const data = { idcompany}; 
//     return await this.api.get(`/team/all`, {params: data});
//   }
}

export default new TeamService();
