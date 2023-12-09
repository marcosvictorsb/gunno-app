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
      model: [
        {
          label: 'Menu',
          items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/dashboard' },
            { label: 'Usuários', icon: 'pi pi-fw pi pi-user', to: '/usuarios' },
            { label: 'Equipes', icon: 'pi pi-fw pi-users', to: '/equipes' },
            { label: 'OKR', icon: 'pi pi-fw pi-compass', to: '/okr' },
            { label: 'Logout', icon: 'pi pi-fw pi-sign-out', to: '/logout' }
          ]
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
