<template>
  <Toast />
  <Loading :is-loading="isLoading" />
  <Panel header="Configurações" class="header-title">
    <form action="">
      <div class="mb-3 checkbox-wrapper">
        <label for="switch1" class="label-config">Liberar cadastro das okr e resultados chaves</label>
        <InputSwitch v-model="showOKRsResultKey" />
      </div>

      <div class="checkbox-wrapper mb-3">
        <label for="switch2" class="label-config">Liberar medição dos resultados chaves</label>
        <InputSwitch v-model="showBtnMeasureOKR" />
      </div>

      <Button label="Salvar alterações" severity="info" @click="updateConfig" class="mt-5" />
    </form>
  </Panel>
</template>
<script>
import Loading from '../../../components/Loading/Loading.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ConfigService from '../../../service/ConfigService';
import InputSwitch from 'primevue/inputswitch';
import Panel from 'primevue/panel';

export default {
  components: {
    InputSwitch,
    Panel,
    Loading
  },
  data() {
    return {
      showOKRsResultKey: false,
      showBtnMeasureOKR: false,
      toast: useToast(),
      confirm: useConfirm(),
      isLoading: false
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    async initialMethods() {
      try {
        this.isLoading = true;
        const idcompany = this.$store.state.user.idcompany;
        const { body } = (await ConfigService.getByIdCompany(idcompany)).data;
        const config = body.result;
        this.showOKRsResultKey = config.showOKRsResultKey;
        this.showBtnMeasureOKR = config.showBtnMeasureOKR;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    async updateConfig() {
      try {
        this.isLoading = true;
        const idcompany = this.$store.state.user.idcompany;
        const config = {
          showOKRsResultKey: this.showOKRsResultKey,
          showBtnMeasureOKR: this.showBtnMeasureOKR
        };
        const { body, status } = (await ConfigService.update(idcompany, config)).data;
        this.toast.add({ severity: 'success', detail: 'Configurações salva', life: 3000 });
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: 'error', detail: 'Error salvar configurações', life: 3000 });
        this.isLoading = false;
        return;
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
