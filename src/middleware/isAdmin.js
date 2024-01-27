import store from '../store';

const isAdmin = (to, from, next) => {
  if (store.state.user.admin) {
    next();
  } else {
    next('/dashboard');
  }
};
export default isAdmin;
