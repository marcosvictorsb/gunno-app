import store from '../store';

const authGuard = (to, from, next) => {
  if (store.state.user.isAuthenticated) {
    next();
  } else {
    next('login');
  }
};

export default authGuard;
