import store from '../store';

const authGuard = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
  } else {
    next('/login');
  }
};
export default authGuard;
