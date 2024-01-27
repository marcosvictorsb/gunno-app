<template>
  <Toast />
  <div class="flex flex-wrap align-items-center justify-content-between gap-2">
    <h3>Planejamento {{ selectedYear }}</h3>
  </div>
  <ConfirmDialog></ConfirmDialog>
  <Loading :isLoading="isLoading" />
  <Dialog v-model:visible="plannerDialog" :style="{ width: '750px' }" :header="plannerDialogTitle" :modal="true" class="p-fluid" :closable="false">
    <div class="field">
      <label for="name">Titulo</label>
      <InputText id="name" v-model.trim="plannerTitle" required="true" autofocus :class="{ 'p-invalid': submitted && !plannerTitle }" />
      <small class="p-error" v-if="submitted && !plannerTitle">Titulo é obrigatório</small>
    </div>

    <div class="field">
      <label for="email">Descrição</label>
      <Textarea id="value" v-model="plannerDescription" :class="{ 'p-invalid': submitted && !plannerDescription }" rows="4" cols="30" aria-describedby="text-error" />
      <small class="p-error" v-if="submitted && !plannerDescription">Descrição é obrigatório</small>
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Editar" icon="pi pi-check" text @click="editPlanner" v-if="isEditPlanner" />
      <Button label="Salvar" icon="pi pi-check" text @click="savePlanner" v-if="!isEditPlanner" />
    </template>
  </Dialog>

  <div class="card">
    <div class="div-button">
      <Button label="Cadastrar planejamento anual" severity="info" @click="addPlanner" class="mb-3 justify-content-end" v-if="selectedYear >= currentYear && this.isAdmin" />
    </div>
    <div v-for="(planner, index) in planners" :key="planner.id" class="mb-3">
      <Panel toggleable>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold">{{ planner.title }}</span>
          </div>
        </template>
        <template #icons>
          <button class="p-panel-header-icon p-link mr-2" @click="toggle($event, index)" v-if="this.isAdmin">
            <span class="pi pi-cog"></span>
          </button>
          <Menu ref="menuPlanner" id="config_menu" :model="items" popup>
            <template #item="{ item, props }">
              <a v-ripple :href="item.url" :target="item.target" v-bind="props.action" @click="action(planner)">
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
              </a>
            </template>
          </Menu>
        </template>
        <p class="m-0">
          {{ planner.description }}
        </p>
      </Panel>
    </div>
  </div>
</template>

<script>
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import Textarea from 'primevue/textarea';
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import PlannerService from '../../../service/PlannerService';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { eventBus } from '../../../components/EventBus/EventBus';
import Loading from '../../../components/Loading/Loading.vue';

export default {
  name: 'planejamento',
  components: {
    Dialog,
    ConfirmDialog,
    Textarea,
    Menu,
    Panel,
    Loading
  },
  data() {
    return {
      active: 0,
      currentYear: new Date().getFullYear(),
      plannerDialog: false,
      plannerDialogTitle: 'Planejamento Anual',
      plannerTitle: '',
      plannerDescription: '',
      toast: useToast(),
      confirm: useConfirm(),
      planners: [],
      PlannerToAction: null,
      items: [
        {
          label: 'Editar',
          icon: 'pi pi-pencil',
          command: () => {
            this.editarPlanner();
          }
        },
        {
          separator: true
        },
        {
          label: 'Deletar',
          icon: 'pi pi-times',
          command: () => {
            this.deletePlanner();
          }
        }
      ],
      menus: [],
      isEditPlanner: false,
      submitted: false,
      buscarHandler: () => {
        console.log('Buscar');
      },
      selectedYear: null,
      isLoading: false,
      isAdmin: false,
    };
  },
  created() {
    this.isAdmin = this.$store.state.user.admin;
    this.selectedYear = this.currentYear;
    this.initialMethods();
  },
  mounted() {
    this.$nextTick(() => {
      this.menus = [];
      this.planners.forEach((planner, index) => {
        const menuRef = this.$refs.menuPlanner[index];
        if (menuRef) {
          this.menus.push(menuRef);
        }
      });
    });

    eventBus.on('evento-planejamento-clicado', this.handler);
  },
  beforeUnmount() {
    // eventBus.on('evento-planejamento-clicado', this.handler);
  },
  methods: {
    resetIntputs() {
      this.plannerTitle = '';
      this.plannerDescription = '';
    },
    addPlanner() {
      this.resetIntputs();
      this.plannerDialog = true;
      this.isEditPlanner = false;
    },
    hideDialog() {
      this.resetIntputs();
      this.plannerDialog = false;
      this.submitted = false;
    },
    async savePlanner() {
      this.submitted = true;

      if (!this.isFormValid()) {
        return;
      }

      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;
      const planner = {
        title: this.plannerTitle,
        description: this.plannerDescription,
        idcompany
      };
      const result = await PlannerService.created(planner);
      const status = result.data.status;
      if (status == 201) {
        this.hideDialog();
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Planejamento cadastrado com sucesso!', life: 3000 });
      }
      this.submitted = false;
      this.initialMethods();
    },
    async getPlannerCurrentYear() {
      try {
        this.isLoading = true;
        const userStore = this.$store.state.user;
        const idcompany = userStore.idcompany;
        const { body } = (await PlannerService.getPlannerByYear(this.currentYear, idcompany)).data;
        this.planners = body.result;
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async initialMethods() {
      await this.getPlannerCurrentYear();
    },
    toggle(event, index) {
      const menuRef = this.$refs.menuPlanner[index];
      if (menuRef) {
        menuRef.toggle(event);
      } else {
        console.error(`Menu reference not found for index ${index}`);
      }
    },
    action(plannerToAction) {
      this.PlannerToAction = plannerToAction;
    },
    editarPlanner() {
      this.plannerDialog = true;
      this.plannerTitle = this.PlannerToAction.title;
      this.plannerDescription = this.PlannerToAction.description;

      this.isEditPlanner = true;
    },
    async editPlanner() {
      try {
        this.submitted = true;
        const payload = {
          id: this.PlannerToAction.id,
          title: this.plannerTitle,
          description: this.plannerDescription
        };
        await PlannerService.edit(payload);
        this.toast.add({ severity: 'success', detail: 'Planejamento editado', life: 3000 });
        this.plannerDialog = false;
        this.submitted = false;
        this.initialMethods();
      } catch (error) {
        this.toast.add({ severity: 'error', sdetail: 'Error ao editar o planejamento', life: 3000 });
        return;
      }
    },
    async deletePlanner() {
      try {
        this.submitted = true;
        await PlannerService.delete(this.PlannerToAction.id);
        this.toast.add({ severity: 'error', summary: 'Exclusão Confirmada', detail: 'Você exclusão o planejamento', life: 3000 });
        this.submitted = false;
        this.initialMethods();
      } catch (error) {
        this.toast.add({ severity: 'error', sdetail: 'Error ao deletar o planejamento', life: 3000 });
        return;
      }
    },
    isFormValid() {
      if (!this.plannerTitle || !this.plannerDescription) {
        return false;
      }
      return true;
    },
    async handler(year) {
      try {
        const userStore = this.$store.state.user;
        const idcompany = userStore.idcompany;
        this.selectedYear = year;
        const { body } = (await PlannerService.getPlannerByYear(year, idcompany)).data;
        this.planners = body.result;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
.div-button {
  display: grid;
}

</style>
