<!-- eslint-disable prettier/prettier -->
<template> 
  <div>
    <ConfirmDialog/>
  </div>
  <div class="flex justify-content-between mb-3">
      <h3>OKRs - {{ selectedYear }} / {{  selectedQuarter }}</h3>
      <Button label="Criar OKR" severity="info" @click="addOKR" size="small" v-if="selectedYear >= currentYear && showOKRsResultKey" />    
  </div>
  
  <Loading :is-loading="isLoading"/>

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
              <Button label="Cadastrar resultados chaves" severity="info" @click="addResultKey(okr.id)" size="small" class="mr-3" v-if="showOKRsResultKey"/>
              <Button label="Editar OKR" @click="showModalOKR(okr)" size="small" class="mr-3" v-if="showOKRsResultKey"/>
              <Button label="Deletar OKR" icon="pi pi-trash" severity="danger" @click="deleteOKR(okr.id)" size="small" v-if="showOKRsResultKey"/>
            </div>            
        </div>
    </template>
    <template #empty> Sem registros disponíveis para exibição </template>

      <Column field="name" header="Resultados chaves" style="width: 30%">
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
            <InputText v-model="data[field]" />
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

      <Column  header="Ações" :rowEditor="true" style="width: 15%; min-width: 8rem" bodyStyle="text-align:center" v-if="showOKRsResultKey || showBtnMeasureOKR">
        <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined raised class="mr-2" @click="editResultKey(slotProps.data)" size="small" v-tooltip.top="{ value: 'Editar resultado chave', showDelay: 500, hideDelay: 300 }"  v-if="showOKRsResultKey" />
            <Button icon="material-symbols-outlined" style="height: 35px;"  outlined raised class="mr-2" severity="info" @click="showMeaseureModal(slotProps.data)"  size="small" v-tooltip.top="{ value: 'Medição do resultado chave', showDelay: 500, hideDelay: 300 }"  v-if="showBtnMeasureOKR" >
              <template #icon>
                <span class="material-symbols-outlined">
                  monitoring
                </span>
              </template>
            </Button>
            <Button icon="pi pi-trash" outlined raised severity="danger" @click="confirmDeleteResultKey(slotProps.data)" size="small" v-tooltip.top="{ value: 'Excluir resultado chave', showDelay: 500, hideDelay: 300 }"  v-if="showOKRsResultKey" />                          
              </template>
      </Column>
    </DataTable>
    <Toast />
  </div>


  <div id="modal-okr">
    <Dialog v-model:visible="okrDialog" :style="{width: '750px'}" header="Criar OKR" :modal="true" class="p-fluid">
      <div class="field">
        <label for="name">Objetivo</label>
        <InputText id="name" v-model.trim="okrName" required="true" autofocus :class="{'p-invalid': submitted && !okrName}" />
        <small class="p-error" v-if="submitted && !okrName">Objetivo é obrigátório</small>
      </div>

      <div class="field">
        <label for="equipe">Equipe</label>
        <Dropdown v-model="selectedTeam" :options="teams" showClear filter optionLabel="name" placeholder="Selecione uma equipe" :class="{ 'p-invalid': hasErrorSelectedTeam }" class="w-full md">          
          <template #value="slotProps">
              <div v-if="slotProps.value" class="flex align-items-center">
                  <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                  {{ slotProps.placeholder }}
              </span>
          </template>
          <template #option="slotProps">
              <div class="flex align-items-center">
                  <div>{{ slotProps.option.name }}</div>
              </div>
          </template>
        </Dropdown>
        <small class="p-error" v-if="hasErrorSelectedTeam">Equipe é obrigatório</small>
      </div>

      <template #footer>
        
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Editar" icon="pi pi-check" text @click="saveOKREdited" v-if="isEditOKR"/>
        <Button label="Salvar" icon="pi pi-check" text @click="saveOkr" v-if="!isEditOKR"/>
      </template>
    </Dialog>
  </div>
  
  <div id="modal-result-key">
    <Dialog v-model:visible="resultkeyDialog" :style="{width: '750px'}" header="Criar OKR" :modal="true" class="p-fluid">
      <div class="field">
        <label for="resultadoChave">Resultado Chaves</label>
        <InputText id="resultadoChave" v-model.trim="resultkeyNameCreated" required="true" autofocus :class="{'p-invalid': submitted && !resultkeyNameCreated}" />
        <small class="p-error" v-if="submitted && !resultkeyNameCreated">Resultado chave é obrigatório</small>
      </div>
      
      <div class="field">
        <label for="valorInicial">Valor Inicial</label>
        <InputGroup>
          <InputNumber id="valorInicial" v-model="resultkeyInitialValue" required="true" autofocus :class="{'p-invalid': submitted && resultkeyInitialValue < 0}" />          
          <InputGroupAddon>%</InputGroupAddon>          
        </InputGroup>
        <small class="p-error" v-if="submitted && resultkeyInitialValue < 0">Valor inicial é obrigatório</small>
        <small class="p-error" v-if="submitted && resultkeyInitialValue === null">Valor inicial é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorAlvo">Valor Alvo</label>
        <InputGroup>
          <InputNumber id="valorAlvo" v-model="resultkeyValueTarget" required="true" autofocus :class="{'p-invalid': submitted && resultkeyValueTarget < 0}" />         
          <InputGroupAddon>%</InputGroupAddon>         
        </InputGroup>
        <small class="p-error" v-if="submitted && resultkeyValueTarget === null">Valor alvo é obrigatório</small>
      </div>

      <div class="field">
        <label for="valorAtual">Valor Atual</label>
        <InputGroup>
          <InputNumber id="valorAtual" v-model="resultkeyValueCurrent" required="true" autofocus :class="{'p-invalid': submitted && resultkeyValueCurrent < 0}" />
          <InputGroupAddon>%</InputGroupAddon>
        </InputGroup>
        <small class="p-error" v-if="resultkeyValueCurrent > resultkeyValueTarget">Valor Atual não pode ser maior que o Valor Alvo</small>
        <small class="p-error" v-if="submitted && resultkeyValueCurrent === null ? true: false">Valor alvo é obrigatório</small>
      </div>

      <div class="field">
        <label for="equipe">Responsável</label>
        <Dropdown :disabled="disableDropdownUser" v-model="selectedUser" showClear :options="users" filter optionLabel="name" placeholder="Selecione um responsavel" class="w-full md" required="true" autofocus :class="{'p-invalid': submitted && (!selectedUser ||Object.keys(selectedUser).length === 0)}"/>
        <small class="p-error" v-if="submitted && (!selectedUser ||Object.keys(selectedUser).length === 0)">Responsável é obrigatório</small>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideResultkeyDialog" />
        <Button label="Editar" icon="pi pi-check" text @click="saveResultKeyEdited" v-if="isEditResultKey"/>
        <Button label="Salvar" icon="pi pi-check" text @click="saveResultKey" v-if="!isEditResultKey"  :disabled="resultkey.valueCurrent > resultkey.valueTarget" />
      </template>
    </Dialog>
  </div>

  <div id="modal-mensure">
    <Dialog v-model:visible="mensureDialog" header="Medição do resultado chave" :modal="true" class="p-fluid" :style="{width: '750px'}">
      
      <div class="field">
        <label for="resultadoChave">Resultado Chaves</label>
        <InputText id="resultadoChave" v-model.trim="resultkeyName" required="true" autofocus disabled />
      </div>

      <div class="field">
        <label for="valorAtual">Valor Atual</label>
        <InputGroup>
          <InputNumber id="valorAtual" v-model="valueCurrent" required="true" autofocus  disabled />
          <InputGroupAddon>%</InputGroupAddon>
        </InputGroup>   
      </div>      
      
      <div class="field">
        <label for="valorAtual">Novo Valor Atual</label>
        <InputGroup>            
          <InputNumber id="valorAtual" v-model="valueMensure" required="true" autofocus :class="{'p-invalid': submitted && valueMensure < 0}" />                    
          <InputGroupAddon>%</InputGroupAddon>
        </InputGroup>  
        <small class="p-error" v-if="submitted && (valueMensure === null ? true : false && valueMensure < 0)">Valor atual é obrigatório</small>
      </div>             

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideMensureDialog" />
        <Button label="Salvar" icon="pi pi-check" text @click="saveMensure" :disabled="valueMensure >= valueTarget" />
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
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Loading from '../../../components/loading/loading.vue';
import OkrService from '../../../service/OkrService';
import UserService from '../../../service/UserService';
import ResultKeyService from '../../../service/ResultKeyService';
import TeamService from '../../../service/TeamService';
import MensureService from '../../../service/MensureService';
import TeamUserService from '../../../service/TeamUserService';
import ConfigService from '../../../service/ConfigService';
import { getCurrentQuarter, getCurrentYear } from '../../../helpers/quarterYears';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { eventBus } from '../../../components/EventBus/EventBus';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    ProgressBar,
    ConfirmDialog,
    Divider,
    Fieldset,
    Loading,
    InputGroup,
    InputGroupAddon
  },
  data() {
    return {
      okrDialog: false,
      okrName: null,
      okrs: [],
      okr: null,
      resultkeys: [],
      resultkey: {},
      resultkeyDialog: false,
      submitted: false,
      toast: useToast(),
      editingRows: [],
      selectedUser: null,
      users: [],
      user: [],
      idObjectives: null,
      loading: false,
      isEditResultKey: false,
      valueProgress: 0,
      resultObjectives: null,
      confirm: useConfirm(),
      idcompany: null,
      legend: `No quarter atual não temos okr cadastradas ainda`,
      isLoading: false,
      year: null,
      selectedYear: null,
      selectedQuarter: null,
      currentYear: new Date().getFullYear(),
      teams: [],
      selectedTeam: null,
      disableDropdownUser: true,
      showOKRsResultKey: null,
      showBtnMeasureOKR: null,
      isEditOKR: false,
      hasErrorSelectedTeam: false,
      mensureDialog: false,
      valueMensure: null,
      valueMensureTarget: null,
      valueCurrent: null,
      resultkeyName: null,
      valueTarget: null,
      IdResultKey: null,
      resultkeyNameCreated: null,
      resultkeyInitialValue: null,
      resultkeyValueCurrent: null,
      resultkeyValueTarget: null,
      resultkeyId: null
    };
  },
  async created() {
    await this.initialMethods();
  },
  mounted() {
    eventBus.on('evento-okr-clicado', this.getOkr);
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    async selectedTeam(newTeam, _oldTeam) {
      if (newTeam != null) {
        this.disableDropdownUser = false;
        this.users = [];
        const { result } = (await TeamUserService.getByTeam(this.selectedTeam.id)).data;
        const idUserByTeam = result;

        idUserByTeam.forEach(async (item) => {
          const { body: bodyUser } = (await UserService.getById(item.userId)).data;
          this.users.push(bodyUser.result);
        });
      }
    }
  },
  methods: {
    addOKR() {
      this.loading = true;
      this.okrDialog = true;
      this.loading = false;
      this.submitted = false;
      this.selectedTeam = null;
      this.okrName = null;
      this.isEditOKR = false;
      this.hasErrorSelectedTeam = false;
    },
    hideDialog() {
      this.okrDialog = false;
      this.submitted = false;
    },
    async saveOkr() {
      try {
        this.submitted = true;
        if (!this.isFormOKRValid()) return;
        const payload = { name: this.okrName, idcompany: this.idcompany, teamId: this.selectedTeam.id };
        await OkrService.created(payload);
        this.toast.add({ severity: 'success', detail: 'Objetivo criado', life: 3000 });
        this.okrDialog = false;
        await this.initialMethods();
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o objetivo', life: 3000 });
      }
    },
    async getObjectiveByQuarter() {
      try {
        const userStore = this.$store.state.user;
        this.idcompany = userStore.idcompany;
        const quarter = getCurrentQuarter();
        this.selectedQuarter = quarter;
        this.selectedYear = getCurrentYear();
        const { data } = await OkrService.getObjectiveByQuarter(quarter, this.idcompany);
        this.resultObjectives = data.result;
        this.okrs = this.mapperProgressValue(this.resultObjectives);
      } catch (error) {
        this.isLoading = false;
        if (error.response.status === 404) {
          return (this.okrs = []);
        }
        console.log(error);
      }
    },
    async getTeams() {
      try {
        const { body: bodyTeam } = (await TeamService.getTeams(this.idcompany)).data;
        this.teams = bodyTeam.result.teams;
      } catch (error) {
        if (error.response.status === 404) {
          return (this.okrs = []);
        }
        console.log(error);
      }
    },
    async getConfigs() {
      try {
        const { body } = (await ConfigService.getByIdCompany(this.$store.state.user.idcompany)).data;
        const config = body.result;
        this.showOKRsResultKey = config.showOKRsResultKey;
        this.showBtnMeasureOKR = config.showBtnMeasureOKR;
      } catch (error) {
        console.log(error);
      }
    },
    async initialMethods() {
      this.isLoading = true;
      await this.getObjectiveByQuarter();
      await this.getTeams();
      await this.getConfigs();
      this.isLoading = false;
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
      this.selectedUser = null;
      this.isEditResultKey = false;
      this.submitted = false;
      this.idObjectives = idObjectives;
      this.resultkeyDialog = true;
      this.selectedTeam = {};
      this.resultkeyNameCreated = null;
      this.resultkeyInitialValue = null;
      this.resultkeyValueCurrent = null;
      this.resultkeyValueTarget = null;
      const { body } = (await UserService.getAllUser(this.idcompany)).data;
      this.users = body.result.users;
    },
    async saveResultKey() {
      try {
        this.submitted = true;
        const payload = {
          name: this.resultkeyNameCreated,
          initialValue: this.resultkeyInitialValue,
          valueCurrent: this.resultkeyValueCurrent,
          valueTarget: this.resultkeyValueTarget,
          objectiveId: this.idObjectives,
          userId: this.selectedUser ? this.selectedUser.id : null,
          companyId: this.idcompany
        };
        if (!this.isFormResultKeyValid(payload)) return;
        await (
          await ResultKeyService.created(payload)
        ).data;
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
      try {
        this.submitted = false;
        this.loading = true;
        this.selectedUser = null;
        this.resultkeyDialog = true;
        this.isEditResultKey = true;

        this.resultkeyNameCreated = resultkey.name;
        this.resultkeyInitialValue = resultkey.initialValue;
        this.resultkeyValueCurrent = resultkey.valueCurrent;
        this.resultkeyValueTarget = resultkey.valueTarget;
        this.idObjectives = resultkey.objectiveId;
        this.resultkeyId = resultkey.id;

        const { body } = (await UserService.getAllUser(this.idcompany)).data;
        this.users = body.result.users;
        this.user = this.users.filter((user) => user.id === resultkey.userId);
        this.selectedUser = this.user[0];
        this.disableDropdownUser = false;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
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
        this.submitted = true;
        const payload = {
          name: this.resultkeyNameCreated,
          initialValue: this.resultkeyInitialValue,
          valueCurrent: this.resultkeyValueCurrent,
          valueTarget: this.resultkeyValueTarget,
          objectiveId: this.idObjectives,
          userId: this.selectedUser ? this.selectedUser.id : null,
          companyId: this.idcompany
        };
        if (!this.isFormResultKeyValid(payload)) return;
        await ResultKeyService.edit(this.resultkeyId, payload);
        this.resultkeyDialog = false;
        this.toast.add({ severity: 'success', detail: 'Resultado chave editado', life: 3000 });
        this.initialMethods();
      } catch (error) {
        console.log(error);
        this.resultkeyDialog = false;
        this.submitted = false;
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
    isFormResultKeyValid(payload) {
      const { companyId, objectiveId, userId, name, initialValue, valueCurrent, valueTarget } = payload;
      const hasIsValid = companyId && objectiveId && userId;
      const hasValueString = name && name.length > 0;
      const valueValid = initialValue && valueCurrent && valueTarget
      const valueGreaterThaZero =  initialValue >= 0 && valueCurrent >= 0 && valueTarget >= 0;
      const valueCurrentGreatThatValueTarget = valueCurrent > valueTarget;
      return payload && hasIsValid && hasValueString && valueGreaterThaZero && !valueCurrentGreatThatValueTarget && valueValid;
    },
    isInitialValueValid(initialValue) {
      const isValid = initialValue && initialValue >= 0;
      return isValid && this.submitted;
    },
    async getOkr(options) {
      try {
        this.isLoading = true;
        this.okrs = null;
        this.resultObjectives = null;
        this.selectedYear = options.year || this.selectedQuarter;
        this.selectedQuarter = options.quarter || this.selectedQuarter;
        const { data } = await OkrService.getObjectiveByFilters(options);
        this.resultObjectives = data.result;
        this.okrs = this.mapperProgressValue(this.resultObjectives);
        this.isLoading = false;
      } catch (error) {
        console.error(error);
        this.legend = `No quarter ${options.quarter} referente ao ano de ${options.year} não tivemos okr`;
        this.okrs = null;
        this.isLoading = false;
      }
    },
    async showModalOKR(okr) {
      this.loading = true;
      this.okrDialog = true;
      this.okrName = okr.name;
      this.okr = okr;
      this.isEditOKR = true;
      const { body } = (await TeamService.getAllTeamsByID(okr.teamId)).data;
      this.selectedTeam = body.result;
      this.loading = false;
    },
    async showMeaseureModal(resultKey) {
      this.isLoading = true;
      this.mensureDialog = true;
      this.resultkeyName = resultKey.name;
      this.valueCurrent = resultKey.valueCurrent;
      this.valueTarget = resultKey.valueTarget;
      this.IdResultKey = resultKey.id;
      this.isLoading = false;
      this.submitted = false;
      this.valueMensure = null;
    },
    hideMensureDialog() {
      this.mensureDialog = false;
      this.valueMensure = null;
      this.resultkeyName = null;
      this.valueCurrent = null;
      this.valueTarget = null;
      this.IdResultKey = null;
    },
    isFormOKRValid() {
      if (!this.okrName) false;
      this.hasErrorSelectedTeam = this.selectedTeam === null ? true : false;
      return !this.hasErrorSelectedTeam && true;
    },
    async saveOKREdited() {
      try {
        this.submitted = true;
        if (!this.isFormOKRValid()) return;
        const payload = { name: this.okrName, idcompany: this.idcompany, teamId: this.selectedTeam.id };
        await OkrService.edit(payload, this.okr.id);
        this.toast.add({ severity: 'success', detail: 'Objetivo criado', life: 3000 });
        this.okrDialog = false;
        await this.initialMethods();
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o objetivo', life: 3000 });
      }
    },
    async saveMensure() {
      try {
        this.submitted = true;
        if (this.valueMensure === null) return;
        const payload = {
          valueCurrent: this.valueMensure,
          resultKeyId: this.IdResultKey
        };
        const result = await MensureService.save(payload);
        this.toast.add({ severity: 'success', detail: 'Medição feita', life: 3000 });
        this.mensureDialog = false;
        await this.initialMethods();
      } catch (error) {
        console.log(error);
        this.toast.add({ severity: 'error', sdetail: 'Erro ao salvar o valor da medição', life: 3000 });
      }
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
