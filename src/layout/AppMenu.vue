<!-- eslint-disable prettier/prettier -->
<template>
    <ul class="layout-menu">
      <template v-for="(item, i) in model" :key="item">
        <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
          <li v-if="item.separator" class="menu-separator"></li>
      </template>
    </ul>
</template>

<script>
import AppMenuItem from './AppMenuItem.vue';
export default {
  components: {
    AppMenuItem
  },
  data() {
    return {
      label: 'Menu',
      items: [
        { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
        { label: 'Planejamento', icon: 'pi pi-fw pi-id-card', to: '/planejamento' },
        { label: 'Usuários', icon: 'pi pi-fw pi pi-user', to: '/usuarios' },
        { label: 'Equipes', icon: 'pi pi-fw pi-users', to: '/equipes' },
        { label: 'OKR', icon: 'pi pi-fw pi-compass', to: '/okr' },
        { separator: true },
        { label: 'Logout', icon: 'pi pi-fw pi-sign-out', to: '/logout' }
      ],
      model: [],
      isAdmin: false
    };
  },
  created() {
    this.createModelForMenu();
  },
  methods: {
    handleMenuSelected(item) {
      this.$emit('menuSelected', item.to);
    },
    createModelForMenu() {
      this.isAdmin = this.$store.state.user.admin;

      if (this.isAdmin) {
        const addMenuPanel = { label: 'Painel', icon: 'pi pi-fw pi-desktop', to: '/painel' };
        this.items.splice(5, 0, addMenuPanel);
      }
      const menu = {
        label: this.label,
        items: this.items
      };
      this.model.push(menu);
    }
  }
};
</script>

<style lang="scss" scoped></style>
