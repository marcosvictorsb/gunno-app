import { computed } from 'vue';
import { topbarMenuActive, router, outsideClickListener } from './AppTopbar.vue';

{
this.unbindOutsideClickListener();

computed: {
logoUrl(); {
return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
}
}
methods: {
const logoUrl = computed(() => {
});

const onTopBarMenuButton = () => {
topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
topbarMenuActive.value = false;
router.push('/documentation');
};
const topbarMenuClasses = computed(() => {
return {
'layout-topbar-menu-mobile-active': topbarMenuActive.value
};
});

const bindOutsideClickListener = () => {
if (!outsideClickListener.value) {
outsideClickListener.value = (event) => {
if (isOutsideClicked(event)) {
topbarMenuActive.value = false;
}
};
document.addEventListener('click', outsideClickListener.value);
}
};
const unbindOutsideClickListener = () => {
if (outsideClickListener.value) {
document.removeEventListener('click', outsideClickListener);
outsideClickListener.value = null;
}
};
const isOutsideClicked = (event) => {
if (!topbarMenuActive.value) return;

const sidebarEl = document.querySelector('.layout-topbar-menu');
const topbarEl = document.querySelector('.layout-topbar-menu-button');

return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
}


}
