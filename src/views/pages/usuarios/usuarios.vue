<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <Loading :is-loading="isLoading"/>
  </div>
  <div>
    <ConfirmDialog></ConfirmDialog>
  </div>
  <div>    
    <DataTable v-model:editingRows="editingRows" :value="users" paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]" 
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
            <span class="text-xl text-900 font-bold">Usuários</span>
            <Button label="Cadastrar usuário" severity="info" @click="addUser" />
        </div>
    </template>

    <Column field="name" header="Nome" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>
      <Column field="email" header="Email" style="width: 20%">
          <template #editor="{ data, field }">
              <InputText v-model="data[field]" />
          </template>
      </Column>
      <Column  header="Ações" :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
        <template #body="slotProps">           
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editUser(slotProps.data)" />
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)" />
          </template>
      </Column>
    </DataTable>
    <Toast />
  </div>
  <div>
    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" :header="userDialogTitle" :modal="true" class="p-fluid" :closable="false">
      <div class="field">
          <label for="name">Nome</label>
          <InputText id="name" v-model.trim="user.name" required="true" autofocus :class="{'p-invalid': submitted && !user.name}" />
          <small class="p-error" v-if="submitted && !user.name">Nome é obrigatório</small>
      </div>

      <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
          <small class="p-error" v-if="submitted && !user.email">Email é obrigatório</small>
      </div>

      <div class="field">
        <label for="equipe">Equipe</label>
        <MultiSelect id="equipe" v-model="selectedTeam" :options="teams" filter optionLabel="name" placeholder="Selecione a equipe"
            :maxSelectedLabels="3" />
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Editar" icon="pi pi-check" text @click="saveUserEdited" v-if="isEditUser"/>
        <Button label="Salvar" icon="pi pi-check" text @click="saveUser" v-if="!isEditUser"/>
      </template>
    </Dialog>
  </div>
  
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import MultiSelect from 'primevue/multiselect';
import UserService from '../../../service/UserService';
import TeamService from '../../../service/TeamService';
import TeamUserService from '../../../service/TeamUserService';
import Loading from '../../../components/Loading/Loading.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    MultiSelect,
    Loading,
    ConfirmDialog
  },
  data() {
    return {
      users: [],
      user: null,
      isEditUser: false,
      teams: [],
      selectedTeam: [],
      editingRows: [],
      userDialog: false,
      userDialogTitle: '',
      submitted: false,
      toast: useToast(),
      confirm: useConfirm(),
      isLoading: false,
      idcompany: null
    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    async editUser(user) {
      try {
        this.isLoading = true;
        this.user = user;
        this.userDialogTitle = 'Informações do usuário';
        this.selectedTeam = [];
        this.isEditUser = true;

        const { status, body } = (await TeamUserService.getByUser(user.id)).data;

        if (status === 404) {
          this.selectedTeam = [];
          return;
        }
        const teamUsers = body.result;
        teamUsers.map(async (item) => {
          const result = (await TeamService.getAllTeamsByID(item.teamId)).data.body.result;
          this.selectedTeam.push(result);
        });
        this.userDialog = true;
        this.isLoading = false;
      } catch (error) {
        console.log({ error });
        this.isLoading = false;
      }
    },
    async hideDialog() {
      this.submitted = false;
      this.userDialog = false;
      await this.initialMethods();
    },
    async initialMethods() {
      try {
        this.isLoading = true;
        const userStore = this.$store.state.user;
        this.idcompany = userStore.idcompany;
        const { body } = (await UserService.getAllUser(this.idcompany)).data;
        this.users = body.result.users;

        const { body: bodyTeam } = (await TeamService.getTeams(this.idcompany)).data;
        this.teams = bodyTeam.result.teams;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async saveUserEdited() {
      try {
        this.submitted = true;
        if (!this.isFormValid()) {
          return;
        }
        const payload = { id: this.user.id, name: this.user.name, email: this.user.email };
        await UserService.edit(payload);
        const payloadTeamUser = { selectedTeam: this.selectedTeam, userId: this.user.id, companyId: this.idcompany };
        await TeamUserService.edit(payloadTeamUser);

        await this.initialMethods();
        this.userDialog = false;
        this.submitted = false;
        this.toast.add({ severity: 'success', detail: 'Usuário editado', life: 3000 });
      } catch (error) {
        this.submitted = false;
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'error', summary: 'Conflito', detail: 'Já existe um usuário com esse email', life: 3000 });
          return;
        }
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o usuário', life: 3000 });
        return;
      }
    },
    async confirmDeleteUser(user) {
      this.confirm.require({
        message: 'Tem certeza de que deseja prosseguir com a exclusão?',
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim',
        rejectLabel: 'Não',
        accept: async () => {
          try {
            await UserService.delete(user.id);
            await this.initialMethods();
            this.toast.add({ severity: 'info', summary: 'Exclusão Confirmada', detail: 'Você confirmou a exclusão do usuário', life: 3000 });
          } catch (error) {
            console.log({ error });
            this.toast.add({ severity: 'error', sdetail: 'Error ao deletar o usuário', life: 3000 });
          }
        },
        reject: () => {
          this.toast.add({ severity: 'error', summary: 'Exclusão Cancelada', detail: 'Você cancelou a exclusão do usuário', life: 3000 });
        }
      });
    },
    addUser() {
      this.userDialog = true;
      this.user = [];
      this.userDialogTitle = 'Cadastrar usuário';
      this.isEditUser = false;
      this.selectedTeam = [];
    },
    async saveUser() {
      try {
        this.submitted = true;

        if (!this.isFormValid()) {
          return;
        }

        const payload = {
          name: this.user.name,
          email: this.user.email,
          password: '123456',
          admin: false,
          idcompany: this.idcompany
        };
        const userCreated = (await UserService.created(payload)).data.body.result;
        const payloadTeamUser = { selectedTeam: this.selectedTeam, userId: userCreated.id, companyId: this.idcompany };
        await TeamUserService.edit(payloadTeamUser);

        await this.initialMethods();
        this.userDialog = false;
        this.submitted = false;
        this.toast.add({ severity: 'success', detail: 'Usuário criado', life: 3000 });
      } catch (error) {
        this.submitted = false;
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'error', summary: 'Conflito', detail: 'Já existe um usuário com esse email', life: 3000 });
          return;
        }
        console.log({ error });
        this.toast.add({ severity: 'error', sdetail: 'Error ao cadastrar o usuário', life: 3000 });
      }
    },
    isFormValid() {
      if (!this.user.name || !this.user.email) {
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
