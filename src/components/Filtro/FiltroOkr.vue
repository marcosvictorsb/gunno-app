<template>
  <div class="layout-filter-sidebar">
    <h6 class="layout-menu item-root-text mb-3 mt-3">Filtro</h6>

    <div class="field">
      <label for="equipe">Selecione o ano</label>
      <Dropdown v-model="selectedYear" :options="years" optionLabel="name" class="w-full" placeholder="Selecione o ano" />
    </div>

    <div class="field">
      <label for="equipe">Selecione o Quarter</label>
      <Dropdown v-model="selectedQuarter" :options="quarters" optionLabel="name" class="w-full" placeholder="Selecione o Quarter" />
    </div>

    <div class="field">
      <label for="equipe">Selecione a equipe</label>
      <Dropdown v-model="selectedTeams" :options="teams" optionLabel="name" class="w-full" placeholder="Selecione a equipe" />
      <Button label="Filtrar" size="small" class="mt-5 mb-3" @click="dispararEvento" />
    </div>
  </div>
</template>
<script>
import Dropdown from 'primevue/dropdown';
import { eventBus } from '../../components/EventBus/EventBus';
import OkrService from '../../service/OkrService';
import TeamService from '../../service/TeamService';

export default {
  components: {
    Dropdown
  },
  data() {
    return {
      years: [],
      selectedYear: null,
      quarters: [{ name: 'Q1' }, { name: 'Q2' }, { name: 'Q3' }, { name: 'Q4' }],
      selectedQuarter: null,
      teams: [],
      selectedTeams: null
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    dispararEvento() {
      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;

      const options = {
        year: this.selectedYear ? this.selectedYear.name : null,
        team: this.selectedTeams ? this.selectedTeams.name : null,
        quarter: this.selectedQuarter ? this.selectedQuarter.name : null,
        idcompany
      };
      eventBus.emit('evento-okr-clicado', options);
    },
    async initialMethods() {
      await this.getAllYears();
      await this.getAllTeams();
    },

    async getAllYears() {
      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;
      const { body } = (await OkrService.getAllYears(idcompany)).data;
      const allYears = body.result;
      this.years = allYears.map((year) => ({ name: year }));
    },

    async getAllTeams() {
      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;
      const { body } = (await TeamService.getTeams(idcompany)).data;
      this.teams = body.result.teams;
    }
  }
};
</script>

<style scoped>
.layout-filter-sidebar {
  /* position: fixed; */
  position: absolute;
  width: 300px;
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 28.5rem;
  left: 2rem;
  transition: transform 0.2s, left 0.2s;
  background-color: var(--surface-overlay);
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
}

.p-float-label label {
  top: 20% !important;
}
</style>
