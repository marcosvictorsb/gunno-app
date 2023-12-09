<template>
  <Toast />
  <div class="flex flex-wrap align-items-center justify-content-between gap-2">
    <h3>Planejamento {{ currentYear }}</h3>
    <Button label="Cadastrar planejamento anual" severity="info" @click="addPlanner" class="mb-3"/>
  </div>
  
  <ConfirmDialog></ConfirmDialog>
  
  <Dialog v-model:visible="plannerDialog" :style="{ width: '750px' }" :header="plannerDialogTitle" :modal="true" class="p-fluid" :closable="false">
    <div class="field">
      <label for="name">Titulo</label>
      <InputText id="name" v-model.trim="plannerTitle" required="true" autofocus :class="{ 'p-invalid': submitted && !plannerTitle }" />
      <small class="p-error" v-if="submitted && !plannerTitle">Titulo é obrigatório</small>
    </div>

    <div class="field">
      <label for="email">Descrição</label>
      <Textarea id="value" v-model="plannerDescription" :class="{ 'p-invalid': errorMessage }" rows="4" cols="30" aria-describedby="text-error" />
      <small class="p-error" v-if="submitted && !plannerDescription">Descrição é obrigatório</small>
    </div>
    <template #footer>
      <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
      <Button label="Editar" icon="pi pi-check" text @click="edit" v-if="isEditUser" />
      <Button label="Salvar" icon="pi pi-check" text @click="savePlanner" v-if="!isEditUser" />
    </template>
  </Dialog>

  <div class="card">
    <div class="flex mb-3 gap-2 justify-content-end">
      <Button @click="active = 0" rounded label="1" class="w-2rem h-2rem p-0" :outlined="active !== 0" />
      <Button @click="active = 1" rounded label="2" class="w-2rem h-2rem p-0" :outlined="active !== 1" />
      <Button @click="active = 2" rounded label="3" class="w-2rem h-2rem p-0" :outlined="active !== 2" />
    </div>
    <Accordion v-model:activeIndex="active">
      <template #title> Simple Card </template>
      <AccordionTab header="Header I">
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
          aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </AccordionTab>
      <AccordionTab header="Header II">
        <p class="m-0">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
          voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
        </p>
      </AccordionTab>
      <AccordionTab header="Header III">
        <p class="m-0">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia
          deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
        </p>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import Textarea from 'primevue/textarea';
import PlannerService from '../../../service/PlannerService';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

export default {
  name: 'planejamento',
  components: {
    Accordion,
    AccordionTab,
    Dialog,
    ConfirmDialog,
    Textarea
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
      confirm: useConfirm()
    };
  },
  created() {
    this.initialMethods();
  },
  methods: {
    resetIntputs() {
      this.plannerTitle = '';
      this.plannerDescription = '';
    },
    addPlanner() {
      this.resetIntputs();
      this.plannerDialog = true;
    },
    hideDialog() {
      this.resetIntputs();
      this.plannerDialog = false;
    },
    async savePlanner() {
      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;
      const planner = {
        title: this.plannerTitle,
        description: this.plannerDescription,
        idcompany,
      };
      const result = await PlannerService.created(planner);
      const status = result.data.status;
      if (status == 201) {
        this.hideDialog();
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Planejamento cadastrado com sucesso!' });
      }
    },
    async getPlannerCurrentYear() {
      const userStore = this.$store.state.user;
      const idcompany = userStore.idcompany;
      await PlannerService.getPlannerCurrentYear(new Date().getFullYear());
    },
    async initialMethods() {
      await this.getPlannerCurrentYear();
    }
  }
};
</script>

<style></style>
