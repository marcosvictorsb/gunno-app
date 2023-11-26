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
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Calendar</span>
      </button>
      <button @click="onTopBarMenuButton()" class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
      <button @click="onSettingsClick()" class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button>
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
      onMenuToggle: onMenuToggle
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
    unbindOutsideClickListener () {
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
