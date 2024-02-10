<template>
  <div class="grid">
    <Card :amount="amountOKR" :title="titleOKR" :icon="iconOKR" />
    <Card :amount="amountResultKey" :title="titleResultKey" :icon="iconResultKey" />
  </div>
</template>

<script>
import DashboardService from '../../../service/DashboardService';
import Card from './components/Card.vue';

export default {
  components: {
    Card
  },
  data() {
    return {
      amountOKR: 0,
      titleOKR: 'Quantidade de OKRs',
      iconOKR: 'target',
      amountResultKey: 0,
      titleResultKey: 'Quantidade de Resultados Chaves',
      iconResultKey: 'key'
    };
  },
  async created() {
    console.log({ a: this.amountOKR, b: this.amountResultKey });
    await this.initialMethods();
    console.log({ a: this.amountOKR, b: this.amountResultKey });
  },
  methods: {
    async initialMethods() {
      await this.getAmountOKR();
      await this.getAmountResultKeys();
    },
    async getAmountOKR() {
      const idcompany = this.$store.state.user.idcompany;
      const { body } = (await DashboardService.getAmountOKR(idcompany)).data;
      this.amountOKR = body.result;
    },

    async getAmountResultKeys() {
      const idcompany = this.$store.state.user.idcompany;
      const { body } = (await DashboardService.getAmountResultKeys(idcompany)).data;
      this.amountResultKey = body.result;
    }
  }
};
</script>
