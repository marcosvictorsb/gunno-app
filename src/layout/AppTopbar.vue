<template>
  <div class="layout-topbar">
    <router-link to="/dashboard" class="layout-topbar-logo">
      <img :src="logoUrl" alt="logo" />
      <span>Gunno</span>
    </router-link>

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

    <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
      <i class="pi pi-ellipsis-v"></i>
    </button>

    <div class="layout-topbar-menu" :class="topbarMenuClasses">
      <button @click="toggleTheme()" class="p-link layout-topbar-button" v-if="!isDarkThemeSetting">
        <i class="pi pi-sun"></i>
        <span>Tema claro</span>
      </button>

      <button @click="toggleTheme()" class="p-link layout-topbar-button" v-if="isDarkThemeSetting">
        <i class="pi pi-moon"></i>
        <span>Tema escuro</span>
      </button>

      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <!-- <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button> -->
    </div>
  </div>
</template>

<script>
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();
const router = useRouter();

export default {
  components: {},
  data() {
    return {
      outsideClickListener: null,
      topbarMenuActive: false,
      onMenuToggle: onMenuToggle,
      isDarkThemeSetting: null
    };
  },
  computed: {
    logoUrl() {
      return `layout/images/${layoutConfig.darkTheme ? 'logo-white' : 'logo-dark'}.svg`;
    },
    topbarMenuClasses() {
      return {
        'layout-topbar-menu-mobile-active': this.topbarMenuActive
      };
    }
  },
  created() {
    this.loadingTheme();
    this.isDarkThemeSetting = this.isDarkTheme();
  },
  methods: {
    onTopBarMenuButton() {
      this.topbarMenuActive = !this.topbarMenuActive;
    },
    onSettingsClick() {
      this.topbarMenuActive = false;
      router.push('/documentation');
    },
    bindOutsideClickListener() {
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event) => {
          if (this.isOutsideClicked(event)) {
            this.topbarMenuActive = false;
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
      if (!this.topbarMenuActive) return;

      const sidebarEl = document.querySelector('.layout-topbar-menu');
      const topbarEl = document.querySelector('.layout-topbar-menu-button');

      return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
    },
    toggleTheme() {
      const themeLink = document.getElementById('theme-css');
      if (themeLink) {
        const currentTheme = themeLink.getAttribute('href');
        const newTheme = currentTheme.includes('light') ? 'dark' : 'light';
        this.saveNewThemeInLocalStorage(newTheme);

        themeLink.setAttribute('href', `/themes/lara-${newTheme}-teal/theme.css`);
      }
      this.isDarkThemeSetting = this.isDarkTheme();
    },
    saveNewThemeInLocalStorage(theme) {
      localStorage.setItem('theme', theme);
    },
    loadingTheme() {
      const theme = localStorage.getItem('theme');
      const themeLink = document.getElementById('theme-css');
      this.isDarkThemeSetting = this.isDarkTheme();
      if (theme !== null && themeLink) {
        themeLink.setAttribute('href', `/themes/lara-${theme}-teal/theme.css`);
      }
    },
    isDarkTheme() {
      const themeSaveInLocalStorege = localStorage.getItem('theme');
      return themeSaveInLocalStorege === 'dark' ? true : false;
    }
  },
  mounted() {
    this.bindOutsideClickListener();
  },
  beforeUnmount() {
    this.unbindOutsideClickListener();
  }
}
</script>

<style lang="scss" scoped></style>
