<template>
  <div class="layout-wrapper" :class="containerClass">
    <app-topbar></app-topbar>
    <div class="layout-sidebar">
      <app-sidebar></app-sidebar>
    </div>

    <FiltroPlanejamento v-if="mostrarFiltroPlanejamento" />
    <FiltroOkr v-if="mostrarFiltroOkr" />

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
      <app-footer></app-footer>
    </div>
    <div class="layout-mask"></div>
  </div>
</template>

<script>
import AppTopbar from './AppTopbar.vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import { useLayout } from '@/layout/composables/layout';
import FiltroPlanejamento from '../components/Filtro/FiltroPlanejamento.vue';
import FiltroOkr from '../components/Filtro/FiltroOkr.vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

export default {
  components: {
    AppFooter,
    AppTopbar,
    AppSidebar,
    FiltroPlanejamento,
    FiltroOkr
  },
  data() {
    return {
      layoutConfig: layoutConfig,
      layoutState: layoutState,
      isSidebarActive: isSidebarActive,
      outsideClickListener: null,
      mostrarFiltroPlanejamento: null,
      mostrarFiltroOkr: null
    };
  },
  created() {
    this.mostrarFiltroPlanejamento = window.location.pathname === '/planejamento';
    this.mostrarFiltroOkr = window.location.pathname === '/okr';
  },
  watch: {
    $route(to) {
      this.mostrarFiltroPlanejamento = to.path === '/planejamento';
      this.mostrarFiltroOkr = to.path === '/okr';
    },
    isSidebarActive(newVal) {
      if (newVal) {
        this.bindOutsideClickListener();
      } else {
        this.unbindOutsideClickListener();
      }
    }
  },
  computed: {
    containerClass() {
      return {
        'layout-theme-dark': this.layoutConfig.darkTheme === 'dark',
        'layout-overlay': this.layoutConfig.menuMode === 'overlay',
        'layout-static': this.layoutConfig.menuMode === 'static',
        'layout-static-inactive': this.layoutState.staticMenuDesktopInactive && this.layoutConfig.menuMode === 'static',
        'layout-overlay-active': this.layoutState.overlayMenuActive,
        'layout-mobile-active': this.layoutState.staticMenuMobileActive,
        'p-input-filled': this.layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !this.layoutConfig.ripple
      };
    }
  },
  methods: {
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event) => {
          if (this.isOutsideClicked(event)) {
            this.layoutState.overlayMenuActive = false;
            this.layoutState.staticMenuMobileActive = false;
            this.layoutState.menuHoverActive = false;
          }
        };
        document.addEventListener('click', this.outsideClickListener);
      }
    },
    unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener('click', this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    isOutsideClicked(event) {
      const sidebarEl = document.querySelector('.layout-sidebar');
      const topbarEl = document.querySelector('.layout-menu-button');
      return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
