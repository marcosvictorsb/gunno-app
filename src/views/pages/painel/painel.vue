<template>
  <Panel header="Configurações" class="header-title">
    <form action="">
      <div class="mb-3 checkbox-wrapper">
        <label for="switch1" class="label-config">Liberar cadastro das okr e resultados chaves</label>
        <InputSwitch v-model="showOKRsResultKey" />
      </div>

      <div class="checkbox-wrapper">
        <label for="switch2" class="label-config">Liberar medição dos resultados chaves</label>
        <InputSwitch v-model="showBtnMeasureOKR" />
      </div>
    </form>
  </Panel>
</template>
<script>
import ConfigService from '../../../service/ConfigService';
import InputSwitch from 'primevue/inputswitch';

export default {
  components: {
    InputSwitch
  },
  data() {
    return {
      showOKRsResultKey: false,
      showBtnMeasureOKR: false
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    async initialMethods() {
      try {
        const idcompany = this.$store.state.user.idcompany;
        const { body } = (await ConfigService.getByIdCompany(idcompany)).data;
        const config = body.result[0];
        this.showOKRsResultKey = config.showOKRsResultKey === 1 ? true : false;
        this.showBtnMeasureOKR = config.showBtnMeasureOKR === 1 ? true : false;
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style scoped>
.label-config {
  font-size: 20px;
  margin-right: 30px;
}

.header-title {
  font-size: 20px;
}

/* body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    } */

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 8px;
}
</style>
