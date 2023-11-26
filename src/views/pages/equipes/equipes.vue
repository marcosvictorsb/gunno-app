<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <ConfirmDialog></ConfirmDialog>
  </div>
  <div>        
    <DataTable v-model:editingRows="editingRows" :value="teams" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" 
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
        <span class="text-xl text-900 font-bold">Equipes</span>
        <Button label="Cadastrar equipes" severity="info" @click="addTeam" />
      </div>
    </template>

    <Column field="name" header="Nome" style="width: 20%">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" />
      </template>
    </Column>
    <!-- <Column field="email" header="Email" style="width: 20%">
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" />
      </template>
    </Column> -->

    <Column  header="Ações" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
      <template #body="slotProps">
        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editTeam(slotProps.data)" />
        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteTeam(slotProps.data)" />
      </template>
    </Column>
  </DataTable>
  
  <Toast />
  </div>
  <div>
    <Dialog v-model:visible="teamDialog" :style="{width: '450px'}" :header="teamDialogTitle" :modal="true" class="p-fluid" :closable="false">
      <div class="field">
        <label for="name">Name</label>
        <InputText id="name" v-model.trim="team.name" required="true" autofocus :class="{'p-invalid': submitted && !team.name}" />
        <small class="p-error" v-if="submitted && !team.name">Nome é obrigatório</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Editar" icon="pi pi-check" text @click="saveTeamEdited" v-if="isEditTeam"/>
        <Button label="Salvar" icon="pi pi-check" text @click="saveTeam" v-if="!isEditTeam"/>
      </template>
    </Dialog>
  </div>    
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import TeamService from '../../../service/TeamService';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    ConfirmDialog
  },
  data() {
    return {
      team: null,
      isEditTeam: false,
      teams: [],
      editingRows: [],
      teamDialog: false,
      teamDialogTitle: '',
      submitted: false,
      toast: useToast(),
      confirm: useConfirm(),
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    async editTeam(team) {
      this.team = team;
      this.teamDialog = true;
      this.isEditTeam = true;
      this.teamDialogTitle = 'Informações da equipe';
    },
    async hideDialog() {
      this.teamDialog = false;
      this.submitted = false;
      await this.initialMethods();
    },
    async initialMethods() {
      try {
        const idcompany = 1;
        const { body } = (await TeamService.getTeams(idcompany)).data;
        this.teams = body.result.teams;
      } catch (error) {
        console.log(error);
      }
    },
    async saveTeamEdited() {
      try {
        this.submitted = true;
        if (!this.isFormValid()) return;
        await TeamService.updateNameTeam(this.team.id, this.team.name);
        await this.initialMethods();
        this.toast.add({ severity: 'success', detail: 'Equipe editada', life: 3000 });
        this.teamDialog = false;
      } catch (error) {
        this.submitted = false;
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'error', summary: 'Conflito', detail: 'Já existe uma equipe com esse nome', life: 3000 });
          return;
        }
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar a equipe', life: 3000 });
        console.log(error);
      }
    },
    async confirmDeleteTeam(team) {
      this.confirm.require({
        message: 'Tem certeza de que deseja prosseguir com a exclusão?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: async () => {
          try {
            await TeamService.deleteTeam(team.id);
            await this.initialMethods();
            this.toast.add({ severity: 'info', summary: 'Exclusão Confirmada', detail: 'Você confirmou a exclusão do time', life: 3000 });
          } catch (error) {
            console.log({ error });
            this.toast.add({ severity: 'error', sdetail: 'Error ao deletar o time', life: 3000 });
          }
        },
        reject: () => {
          this.toast.add({ severity: 'error', summary: 'Exclusão Cancelada', detail: 'Você cancelou a exclusão do time', life: 3000 });
        }
      });
    },
    addTeam() {
      this.teamDialog = true;
      this.teamDialogTitle = 'Cadastrar equipe';
      this.team = [];
      this.isEditTeam = false;
    },
    async saveTeam() {
      try {
        this.submitted = true;
        if (!this.isFormValid()) return;

        const idcompany = 1;
        await TeamService.created(this.team.name, idcompany);
        await this.initialMethods();
        this.teamDialog = false;
        this.submitted = false;
        this.toast.add({ severity: 'success', detail: 'Equipe criada', life: 3000 });
      } catch (error) {
        this.submitted = false;
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'error', summary: 'Conflito', detail: 'Já existe uma equipe com esse nome', life: 3000 });
          return;
        }
        this.teamDialog = false;
        this.toast.add({ severity: 'error', detail: 'Error ao salvar a equipe', life: 3000 });
        console.log(error);
      }
    },
    isFormValid() {
      if (!this.team.name) {
        return false;
      }

      return true;
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
