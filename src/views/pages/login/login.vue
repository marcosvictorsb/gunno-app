<template>
  <Toast />
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="flex flex-column align-items-center justify-content-center">
      <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
          <div class="text-center mb-5">
            <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
            <!-- <div class="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div> -->
            <div class="text-900 text-3xl font-medium mb-3">Bem vindo!</div>
            <!-- <span class="text-600 font-medium">Sign in to continue</span> -->
          </div>

          <form>
            <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
            <InputText id="email1" type="text" placeholder="Email" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

            <label for="password1" class="block text-900 font-medium text-xl mb-2">Senha</label>
            <Password id="password1" v-model="password" placeholder="Senha" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }" :feedback="false"></Password>

            <div class="flex align-items-center justify-content-between mb-5 gap-5">
              <div class="flex align-items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Manter-me conectado</label>
              </div>
              <!-- <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Esqueceu a senha?</a> -->
            </div>
            <Button label="Entrar" class="w-full p-3 text-xl" @click="auth"></Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useLayout } from '@/layout/composables/layout';
import AuthService from '../../../service/AuthService';
import { useToast } from 'primevue/usetoast';
const { layoutConfig } = useLayout();

export default {
  name: 'login',
  components: {},
  data() {
    return {
      email: '',
      password: '',
      checked: false,
      layoutConfig: layoutConfig,
      toast: useToast()
    };
  },
  created() {
    console.log();
  },
  methods: {
    async auth() {
      try {
        const { status, body } = (await AuthService.auth(this.email, this.password)).data;
        const user = body.result;
        if (status === 200) {
          this.$store.commit('setUser', user);
          this.$router.push({ name: 'dashboard' });
        }
      } catch (error) {
        console.log(error);
        if (error.response.data.status === 409) {
          this.toast.add({ severity: 'warn', summary: 'Falha no Login', detail: 'Credenciais inválidas. Por favor, verifique seu e-mail e senha e tente novamente', life: 8000 });
          return;
        }
      }
    }
  },
  computed: {
    logoUrl() {
      return `layout/images/${layoutConfig.darkTheme ? 'logo-white' : 'logo-dark'}.svg`;
    }
  }
}
</script>
<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
