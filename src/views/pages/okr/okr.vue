<!-- eslint-disable prettier/prettier -->
<template> 
  <div>
    <ConfirmDialog/>
  </div>
  <div class="flex justify-content-end mb-3">    
    <Button label="Criar OKR" severity="info" @click="addOKR" />    
  </div>
  
  <Fieldset :legend="legend" v-if="!resultObjectives">    
    <p class="m-0">
      Neste trimestre, não foram cadastrados ainda Objetivos e Resultados-Chave (OKRs) no sistema. 
    </p>
  </Fieldset>

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
            <div>
              <Button label="Cadastrar resultados chaves" severity="info" @click="addResultKey(okr.id)" size="small" class="mr-3"/>
              <Button label="Deletar OKR" icon="pi pi-trash" severity="danger" @click="deleteOKR(okr.id)" size="small"/>
            </div>            
        </div>
    </template>
    <template #empty> Sem registros disponíveis para exibição </template>

      <Column field="name" header="Resultados chaves" style="width: 35%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column field="progressValue" header="Progresso" style="width: 15%" class="progresso">
        <template #body="{ data, field }">
            <ProgressBar :value=" data[field] === 0 ? 1 : data[field]" :showValue="false" style="height: 6px"></ProgressBar>
            <Divider align="center" type="dotted">
              <b>{{ data[field] }}%</b>
            </Divider>
        </template>
      </Column>

      <Column field="initialValue" header="Valor Inicial" style="width: 10%">
          <template #editor="{ data, field }">
              <InputNumber v-model="data[field]" />
          </template>
      </Column>

      <Column field="valueTarget" header="Valor Alvo" style="width: 10%">
          <template #editor="{ data, field }">
              s
          </template>
      </Column>

      <Column field="valueCurrent" header="Valor Atual" style="width: 10%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column field="assign" header="Responsável" style="width: 10%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>

      <Column  header="Ações" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
        <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editResultKey(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteResultKey(slotProps.data)" />
          </template>
      </Column>
    </DataTable>
    <Toast />
  </div>


  <div>
    <Dialog v-model:visible="okrDialog" :style="{width: '450px'}" header="Criar OKR" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name">Objetivo</label>
        <InputText id="name" v-model.trim="okrName" required="true" autofocus :class="{'p-invalid': submitted && !okrName}" />
        <small class="p-error" v-if="submitted && !okrName">Objetivo é obrigátório</small>
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
        <InputNumber id="valorInicial" v-model="resultkey.initialValue" required="true" autofocus :class="{'p-invalid': submitted && resultkey.initialValue < 0}" />
        <small class="p-error" v-if="submitted && resultkey.initialValue < 0">Valor inicial é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorAlvo">Valor Alvo</label>
        <InputNumber id="valorAlvo" v-model="resultkey.valueTarget" required="true" autofocus :class="{'p-invalid': submitted && resultkey.valueTarget < 0}" />
        <small class="p-error" v-if="submitted && resultkey.valueTarget < 0">Valor alvo é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorAtual">Valor Atual</label>
        <InputNumber id="valorAtual" v-model="resultkey.valueCurrent" required="true" autofocus :class="{'p-invalid': submitted && resultkey.valueCurrent < 0}" />
        <small class="p-error" v-if="submitted && resultkey.valueCurrent < 0">Valor atual é obrigatório</small>
        <small class="p-error" v-if="resultkey.valueCurrent > resultkey.valueTarget">Valor Atual não pode ser maior que o Valor Alvo</small>
      </div>

      <div class="field">
        <label for="equipe">Responsável</label>
        <Dropdown v-model="selectedUser" :options="users" filter optionLabel="name" placeholder="Selecione um responsavel" class="w-full md" required="true" autofocus :class="{'p-invalid': submitted && Object.keys(selectedUser).length === 0}"/>
        <small class="p-error" v-if="submitted && Object.keys(selectedUser).length === 0">Responsável é obrigatório</small>
      </div>

      <template #footer>
        
        <Button label="Cancelar" icon="pi pi-times" text @click="hideResultkeyDialog" />
        <Button label="Editar" icon="pi pi-check" text @click="saveResultKeyEdited" v-if="isEditResultKey"/>
        <Button label="Salvar" icon="pi pi-check" text @click="saveResultKey" v-if="!isEditResultKey"  :disabled="resultkey.valueCurrent > resultkey.valueTarget" />
      </template>
    </Dialog>
  </div>
</template>
<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import ConfirmDialog from 'primevue/confirmdialog';
import Divider from 'primevue/divider';
import Fieldset from 'primevue/fieldset';

import OkrService from '../../../service/OkrService';
import UserService from '../../../service/UserService';
import ResultKeyService from '../../../service/ResultKeyService';
import { getCurrentQuarter } from '../../../helpers/quarterYears';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    ProgressBar,
    ConfirmDialog,
    Divider,
    Fieldset
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
      toast: useToast(),
      editingRows: [],
      selectedUser: {},
      users: [],
      user: [],
      idObjectives: null,
      loading: false,
      isEditResultKey: false,
      valueProgress: 0,
      resultObjectives: null,
      confirm: useConfirm(),
      idcompany: null,
      legend: `No quarter atual não temos okr cadastradas ainda`
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    addOKR() {
      this.loading = true;
      this.okrDialog = true;
      this.loading = false;
      this.submitted = false;
    },
    hideDialog() {
      this.okrDialog = false;
      this.submitted = false;
    },
    async saveOkr() {
      try {
        this.submitted = true;
        if (!this.okrName) return;
        const payload = { name: this.okrName, idcompany: this.idcompany };
        const result = await OkrService.created(payload);
        this.toast.add({ severity: 'success', detail: 'Objetivo criado', life: 3000 });
        this.okrDialog = false;
        await this.initialMethods();
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o objetivo', life: 3000 });
      }
    },
    async initialMethods() {
      try {
        const userStore = this.$store.state.user;
        this.idcompany = userStore.idcompany;
        const quarter = getCurrentQuarter();
        const { data } = await OkrService.getObjectiveByQuarter(quarter, this.idcompany);
        this.resultObjectives = data.result;
        this.okrs = this.mapperProgressValue(this.resultObjectives);
      } catch (error) {
        if (error.response.status === 404) {
          return (this.okrs = []);
        }
        console.log(error);
      }
    },
    mapperProgressValue(resultObjectives) {
      return Object.keys(resultObjectives).reduce((acc, key) => {
        const objective = resultObjectives[key];
        const resultKeyWithProgress = objective.resultKeys.map((result) => ({
          ...result,
          progressValue: this.calculateProgressValue(result)
        }));

        acc[key] = {
          ...objective,
          resultKeys: resultKeyWithProgress
        };
        return acc;
      }, {});
    },
    calculateProgressValue(key) {
      const difference = key.valueCurrent - key.initialValue;
      const valueProgress = (difference * 100) / (key.valueTarget - key.initialValue);
      return parseFloat(valueProgress.toFixed(2));
    },
    async addResultKey(idObjectives) {
      this.resultkey = [];
      this.selectedUser = {};
      this.isEditResultKey = false;
      this.submitted = false;
      this.idObjectives = idObjectives;
      this.resultkeyDialog = true;
      const { body } = (await UserService.getAllUser(this.idcompany)).data;
      this.users = body.result.users;
    },
    async saveResultKey() {
      try {
        this.submitted = true;
        const payload = {
          ...this.resultkey,
          objectiveId: this.idObjectives,
          userId: this.selectedUser.id,
          companyId: this.idcompany
        };
        if (!this.isFormValid(payload)) return;
        const { body, result } = await (await ResultKeyService.created(payload)).data;
        await this.initialMethods();
        this.toast.add({ severity: 'success', detail: 'Resultado chave criado', life: 3000 });
        this.resultkeyDialog = false;
        this.submitted = false;
      } catch (error) {
        this.submitted = false;
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o resultado chave', life: 3000 });
        console.log(error);
      }
    },
    hideResultkeyDialog() {
      this.resultkeyDialog = false;
    },
    async editResultKey(resultkey) {
      this.loading = true;
      this.resultkey = resultkey;
      this.resultkeyDialog = true;
      this.isEditResultKey = true;

      const { body } = (await UserService.getAllUser(this.idcompany)).data;
      this.users = body.result.users;
      this.user = this.users.filter((user) => user.id === this.resultkey.userId);
      this.selectedUser = this.user[0];
      this.loading = false;
    },
    async deleteOKR(idOkr) {
      this.confirm.require({
        message: 'Todos os resultados chaves serão deletados. Tem certeza de que deseja prosseguir com a exclusão?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: async () => {
          try {
            await OkrService.delete(idOkr);
            await this.initialMethods();
            this.toast.add({ severity: 'info', summary: 'Exclusão Confirmada', detail: 'Você confirmou a exclusão da okr e seus resultados chaves', life: 3000 });
          } catch (error) {
            console.log({ error });
            this.toast.add({ severity: 'error', sdetail: 'Error ao deletar a okr', life: 3000 });
          }
        },
        reject: () => {
          this.toast.add({ severity: 'error', summary: 'Exclusão Cancelada', detail: 'Você cancelou a exclusão', life: 3000 });
        }
      });
    },
    async saveResultKeyEdited() {
      try {
        const payload = {
          name: this.resultkey.name,
          valueTarget: this.resultkey.valueTarget,
          initialValue: this.resultkey.initialValue,
          valueCurrent: this.resultkey.valueCurrent,
          objectiveId: this.resultkey.objectiveId,
          userId: this.selectedUser.id
        };
        await ResultKeyService.edit(this.resultkey.id, payload);
        this.resultkeyDialog = false;
        this.toast.add({ severity: 'success', detail: 'Resultado chave editado', life: 3000 });
        this.initialMethods();
      } catch (error) {
        this.resultkeyDialog = false;
      }
    },
    confirmDeleteResultKey(resultKey) {
      this.confirm.require({
        message: 'Tem certeza de que deseja prosseguir com a exclusão?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: async () => {
          try {
            await ResultKeyService.delete(resultKey.id);
            await this.initialMethods();
            this.toast.add({ severity: 'info', summary: 'Exclusão Confirmada', detail: 'Você confirmou a exclusão do resultado chave', life: 3000 });
          } catch (error) {
            console.log({ error });
            this.toast.add({ severity: 'error', sdetail: 'Error ao deletar o resultado chave', life: 3000 });
          }
        },
        reject: () => {
          this.toast.add({ severity: 'error', summary: 'Exclusão Cancelada', detail: 'Você cancelou a exclusão', life: 3000 });
        }
      });
    },
    isFormValid(payload) {
      return payload && payload.companyId && payload.initialValue >= 0 && payload.name && payload.objectiveId && payload.userId && payload.valueCurrent >= 0 && payload.valueTarget >= 0;
    },
    isInitialValueValid(initialValue) {
      const isValid = initialValue && initialValue >= 0;
      return isValid && this.submitted;
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

.progresso {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
