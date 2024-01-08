<template>
  <div class="layout-filter-sidebar">
    <h6 class="layout-menu item-root-text mb-3 mt-3">Filtro</h6>

    <div class="field">
      <label for="equipe">Selecione o ano</label>
      <Dropdown v-model="selectedYear" :options="years" optionLabel="name" class="w-full" placeholder="Selecione o ano" />
      <Button label="Filtrar" size="small" class="mt-5 mb-3" @click="dispararEvento" />
    </div>
  </div>
</template>
<script>
import Dropdown from 'primevue/dropdown';
import { eventBus } from '../../components/EventBus/EventBus';
import PlannerService from '../../service/PlannerService';

export default {
  components: {
    Dropdown
  },
  data() {
    return {
      years: [],
      selectedYear: null
    };
  },
  async created() {
    await this.getAllYears();
  },
  methods: {
    dispararEvento() {
      eventBus.emit('evento-filtro-clicado', this.selectedYear.name);
    },

    async getAllYears() {
      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;
      const { body } = (await PlannerService.getAllYears(idcompany)).data;
      const allYears = body.result;
      this.years = allYears.map((year) => ({ name: year }));
    }
  }
};
</script>

<style scoped>
.layout-filter-sidebar {
  position: fixed;
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
