<!-- eslint-disable prettier/prettier -->
<template>
  <div class="flex justify-content-end mb-3">
    <Button label="Criar OKR" severity="info" @click="addOKR" />
  </div>
  <div v-for="(okr, index) in okrs" :key="index" class="mb-5">
    <DataTable v-model:editingRows="editingRows" :value="okr.resultKeys"  
    showGridlines editMode="row" dataKey="id" class="p-datatable-sm"
    :pt="{
        table: { style: 'min-width: 50rem' },
        column: {
            bodycell: ({ state }) => ({
                style:  state['d_editing']&&'padding-top: 0.6rem; padding-bottom: 0.6rem' 
            })
        }
    }">

    <template #header>
        <div class="flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="text-xl text-900 font-bold">{{ okr.name }}</span>
            <Button label="Cadastrar resultados chaves" severity="info" @click="addResultKey(okr.id)" size="small"/>
        </div>
    </template>

      <Column field="name" header="Nome" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>
      <Column field="initialValue" header="Valor Inicial" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column field="valueCurrent" header="Valor Alvo" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column field="valueCurrent" header="Valor Corrente" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column field="userId" header="Responsável" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column  header="Ações" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
        <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editResultKey(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
          </template>
      </Column>
    </DataTable>
  </div>


  <div>
    <Dialog v-model:visible="okrDialog" :style="{width: '450px'}" header="Criar OKR" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name">Objetivo</label>
        <InputText id="name" v-model.trim="okrName" required="true" autofocus :class="{'p-invalid': submitted && !okrName}" />
        <small class="p-error" v-if="submitted && !okrName">Nome is required.</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <!-- <Button label="Editar" icon="pi pi-check" text @click="saveTeamEdited" v-if="isEditTeam"/> -->
        <Button label="Salvar" icon="pi pi-check" text @click="saveOkr" />
      </template>
    </Dialog>
  </div>
  
  <div>
    <Dialog v-model:visible="resultkeyDialog" :style="{width: '450px'}" header="Criar OKR" :modal="true" class="p-fluid">
      <div class="field">
        <label for="resultadoChave">Resultado Chaves</label>
        <InputText id="resultadoChave" v-model.trim="resultkey.name" required="true" autofocus :class="{'p-invalid': submitted && !resultkey.name}" />
        <small class="p-error" v-if="submitted && !resultkey.name">Resultado chave é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorInicial">Valor Inicial</label>
        <InputNumber id="valorInicial" v-model.trim="resultkey.initialValue" required="true" autofocus :class="{'p-invalid': submitted && !resultkey.initialValue}" />
        <small class="p-error" v-if="submitted && !resultkey.initialValue">Valor inicial é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorAlvo">Valor Alvo</label>
        <InputNumber id="valorAlvo" v-model.trim="resultkey.valueTarget" required="true" autofocus :class="{'p-invalid': submitted && !resultkey.valueTarget}" />
        <small class="p-error" v-if="submitted && !resultkey.valueTarget">Valor alvo é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorAtual">Valor Atual</label>
        <InputNumber id="valorAtual" v-model.trim="resultkey.valueCurrent" required="true" autofocus :class="{'p-invalid': submitted && !resultkey.valueCurrent}" />
        <small class="p-error" v-if="submitted && !resultkey.valueCurrent">Valor atual é obrigatório.</small>
      </div>

      <div class="field">
        <label for="equipe">Responsável</label>
        <Dropdown v-model="selectedUser" :options="users" filter optionLabel="name" placeholder="Selecione um responsavel" class="w-full md" />
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideResultkeyDialog" />
        <!-- <Button label="Editar" icon="pi pi-check" text @click="saveTeamEdited" v-if="isEditTeam"/> -->
        <Button label="Salvar" icon="pi pi-check" text @click="saveResultKey" />
      </template>
    </Dialog>
  </div>
  </template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import OkrService from '../../../service/OkrService';
import UserService from '../../../service/UserService';
import ResultKeyService from '../../../service/ResultKeyService';
import { getCurrentQuarter } from '../../../helpers/quarterYears';
import { useToast } from 'primevue/usetoast';

export default {
  components: {
    DataTable,
    Column,
    Dialog
  },
  data() {
    return {
      okrDialog: false,
      okrName: null,
      okrs: [],
      resultkeys: [],
      resultkey: {},
      resultkeyDialog: false,
      submitted: false,
      idcompany: 1,
      toast: useToast(),
      editingRows: [],
      selectedUser: [],
      users: [],
      user: [],
      idObjectives: null
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    addOKR() {
      this.okrDialog = true;
    },
    hideDialog() {
      this.okrDialog = false;
    },
    async saveOkr() {
      try {
        const payload = { name: this.okrName, idcompany: this.idcompany };
        const result = await OkrService.created(payload);
        this.toast.add({ severity: 'success', detail: 'Objetivo criado', life: 3000 });
        await this.initialMethods();
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o objetivo', life: 3000 });
      }
    },
    async initialMethods() {
      try {
        const quarter = getCurrentQuarter();
        const { data, status } = await OkrService.getObjectiveByQuarter(quarter, this.idcompany);
        this.okrs = data.result;
      } catch (error) {
        console.log(error);
      }
    },
    async addResultKey(idObjectives) {
      this.idObjectives = idObjectives;
      this.resultkeyDialog = true;
      const { body } = (await UserService.getAllUser(this.idcompany)).data;
      this.users = body.result.users;
    },
    async saveResultKey() {
      try {
        const payload = {
          ...this.resultkey,
          objectiveId: this.idObjectives,
          userId: this.selectedUser.id,
          companyId: this.idcompany
        };
        const { body, result } = await (await ResultKeyService.created(payload)).data;
        this.resultkeyDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    hideResultkeyDialog() {
      this.resultkeyDialog = false;
    },
    async editResultKey(resultkey) {
      this.resultkey = resultkey;
      this.resultkeyDialog = true;

      const { body } = (await UserService.getAllUser(this.idcompany)).data;
      this.users = body.result.users;
      this.user = this.users.filter((user) => user.id === this.resultkey.userId);
      this.selectedUser = this.user[0];
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep(.p-datatable-frozen-tbody) {
  font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
  font-weight: bold;
}
</style>