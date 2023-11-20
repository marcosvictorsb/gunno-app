<!-- eslint-disable prettier/prettier -->
<template>
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
    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" :header="userDialogTitle" :modal="true" class="p-fluid">
      <div class="field">
          <label for="name">Name</label>
          <InputText id="name" v-model.trim="user.name" required="true" autofocus :class="{'p-invalid': submitted && !user.name}" />
          <small class="p-error" v-if="submitted && !user.name">Nome is required.</small>
      </div>

      <div class="field">
          <label for="email">Email</label>
          <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
          <small class="p-error" v-if="submitted && !user.email">Email é obrigatório.</small>
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
import MultiSelect from 'primevue/multiselect';
import UserService from '../../../service/UserService';
import TeamService from '../../../service/TeamService';
import TeamUserService from '../../../service/TeamUserService';
import { useToast } from 'primevue/usetoast';

export default {
  components: {
    DataTable,
    Column,
    Dialog,
    MultiSelect
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
      toast: useToast()

    };
  },
  async created() {
    await this.initialMethods();
  },
  methods: {
    async editUser(user) {
      try {
        this.user = user;
        this.userDialog = true;
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
      } catch (error) {
        console.log({ error });
      }
    },
    async hideDialog() {
      this.userDialog = false;
      await this.initialMethods();
    },
    async initialMethods() {
      const { body } = (await UserService.getAllUser(1)).data;
      this.users = body.result.users;

      const { body: bodyTeam } = (await TeamService.getTeams(1)).data;
      this.teams = bodyTeam.result.teams;
    },
    async saveUserEdited() {
      try {
        const payload = { id: this.user.id, name: this.user.name, email: this.user.email };
        await UserService.edit(payload);
        const payloadTeamUser = { selectedTeam: this.selectedTeam, userId: this.user.id, companyId: 1 };
        await TeamUserService.edit(payloadTeamUser);

        await this.initialMethods();
        this.userDialog = false;
        this.toast.add({ severity: 'success', detail: 'Usuário editado', life: 3000 });
      } catch (error) {
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'error', summary: 'Conflito', detail: 'Já existe um usuário com esse email', life: 3000 });
          return;
        }
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o usuário', life: 3000 });
        return;
      }
    },
    async confirmDeleteUser(user) {
      try {
        await UserService.delete(user.id);
        await this.initialMethods();
        this.toast.add({ severity: 'success', detail: 'Usuário deletado', life: 3000 });
      } catch (error) {
        console.log({ error });
        this.toast.add({ severity: 'error', sdetail: 'Error ao deletar o usuário', life: 3000 });
      }
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
        const payload = {
          name: this.user.name,
          email: this.user.email,
          password: '123456',
          admin: false,
          idcompany: 1
        };
        const userCreated = (await UserService.created(payload)).data.body.result;
        const payloadTeamUser = { selectedTeam: this.selectedTeam, userId: userCreated.id, companyId: 1 };
        await TeamUserService.edit(payloadTeamUser);

        await this.initialMethods();
        this.userDialog = false;
        this.toast.add({ severity: 'success', detail: 'Usuário criado', life: 3000 });
      } catch (error) {
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'error', summary: 'Conflito', detail: 'Já existe um usuário com esse email', life: 3000 });
          return;
        }
        console.log({ error });
        this.toast.add({ severity: 'error', sdetail: 'Error ao cadastrar o usuário', life: 3000 });
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
</style>
