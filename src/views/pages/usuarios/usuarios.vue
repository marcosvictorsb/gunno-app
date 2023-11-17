<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <DataTable v-model:editingRows="editingRows" :value="users" showGridlines editMode="row" dataKey="id"
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
            <Button label="Cadastrar usuário" severity="info" />
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
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
          </template>
      </Column>
    </DataTable>
  </div>
  <div>
    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Informações do usuário" :modal="true" class="p-fluid">
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
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Save" icon="pi pi-check" text @click="saveUserEdited" />
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
      teams: [],
      selectedTeam: [],
      editingRows: [],
      userDialog: false,
      submitted: false
    };
  },
  async created() {
    await this.initialMethods();
  },
  mounted() {
    //vProductService.getProductsMini().then((data) => (this.products = data));
  },
  methods: {
    async editUser(user) {
      this.user = user;
      this.userDialog = true;
      this.selectedTeam = [];

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
    },
    hideDialog() {
      this.userDialog = false;
    },
    async initialMethods() {
      const { body } = (await UserService.getAllUser('0c749690-345c-4f98-9272-d18557c10386')).data;
      this.users = body.result.users;

      const { body: bodyTeam } = (await TeamService.getTeams('0c749690-345c-4f98-9272-d18557c10386')).data;
      this.teams = bodyTeam.result.teams;
    },
    async saveUserEdited() {
      try {
        const payload = { id: this.user.id, name: this.user.name, email: this.user.email };
        await UserService.edit(payload);
        const payloadTeamUser = { selectedTeam: this.selectedTeam, userId: this.user.id, companyId: '0c749690-345c-4f98-9272-d18557c10386' };
        await TeamUserService.edit(payloadTeamUser);

        await this.initialMethods();
        this.userDialog = false;
      } catch (error) {
        return 0;
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
