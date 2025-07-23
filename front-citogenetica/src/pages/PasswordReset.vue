<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import apiClient from '../axiosConfig';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import BackButton from '../components/BackButton.vue';
import { Button, Password, FloatLabel } from 'primevue';

export default defineComponent({
    name: "PasswordReset",
    components: {
        AppHeader,
        AppFooter,
        BackButton,
        Password,
        Button,
        FloatLabel
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const route = useRoute();
        const newPassword = ref<string>('');
        const confirmNewPassword = ref<string>('');
        const token = ref<string | null>(null);

        onMounted(() => {
            token.value = route.query.token as string;
            if (!token.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Token de redefinição de senha não encontrado.'
                });
                router.push('/Login');
            }
        });

        const handleSubmit = async () => {
            if (!newPassword.value || !confirmNewPassword.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Por favor, preencha todos os campos.'
                });
                return;
            }

            if (newPassword.value !== confirmNewPassword.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'As senhas não coincidem.'
                });
                return;
            }

            try {
                await apiClient.post('/auth/reset-password', {
                    token: token.value,
                    newPassword: newPassword.value
                });
                toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Senha redefinida com sucesso!'
                });
                router.push('/Login');
            } catch (error: any) {
                const detail = error.response?.data?.message || 'Erro ao redefinir senha.';
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: detail
                });
            }
        };

        const handleCancel = () => {
            router.push('/Login');
        };

        return {
            newPassword,
            confirmNewPassword,
            handleSubmit,
            handleCancel,
        };
    }
});
</script>

<template>
  <div id="container-login">
    <Toast position="top-left" />
    <aside id="bloco-imagem-login">
      <BackButton to="/Login" style="position: fixed; top: 30px; left: 30px;" />
      <div id="img-login-div">
        <img id="img-login" src="../assets/login.png" />
      </div>
    </aside>

    <main id="bloco-texto-login">
      <h1 id="titulo-login">Redefinir Senha</h1>
      <section id="box-form-login">
        <FloatLabel variant="on">
          <Password v-tooltip="'Insira sua nova senha'" id="newPassword" v-model="newPassword" :feedback="false"
            toggleMask fluid class="login-input" />
          <label for="newPassword">Nova Senha</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password v-tooltip="'Confirme sua nova senha'" id="confirmNewPassword" v-model="confirmNewPassword"
            :feedback="false" toggleMask fluid class="login-input" />
          <label for="confirmNewPassword">Confirmar Nova Senha</label>
        </FloatLabel>

        <div class="buttons">
          <Button @click="handleSubmit" label="Redefinir" />
          <Button @click="handleCancel" label="Cancelar" severity="danger" />
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss">
@use '../assets/styles/variables' as *;

#container-login {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: #fff;
}

#bloco-imagem-login {
  height: 100vh;
  width: 65%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  .bt-voltar-fixed {
    position: fixed;
    top: 30px;
    left: 30px;
  }

  @media (max-width: 1024px) {
    .bt-voltar-fixed {
      position: relative;
      top: auto;
      left: auto;
      margin-bottom: 20px;
    }
  }

  #img-login-div {
    background-color: #fff;
    width: 100%;

    #img-login {
      width: 100%;
    }
  }
}

#bloco-texto-login {
  background-color: #0062ae;
  height: 100vh;
  width: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#titulo-login {
  font-weight: 200;
  color: #f8f5f5;
}

#box-form-login {
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  .link-login {
    text-align: center;
    display: flex;

    .a-login {
      display: block;
      text-decoration: none;
      margin: 5px 0;
      color: #fff;
      padding: 10px;
      font-style: normal;

      &:hover {
        color: #c8dbeb;
      }
    }
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
      width: 120px;
      height: 40px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  }
}


@media (max-width: 1024px) {
  #container-login {
    flex-direction: column;
    padding: 20px;
  }

  #bloco-texto-login {
    width: 100%;
    height: 60vh;
    padding: 20px;
  }

  form {
    width: 90%;
    max-width: 350px;
  }

  .login-input {
    width: 100%;
    max-width: 350px;
  }

  #bloco-imagem-login,
  #img-login-div {
    width: 100%;
    height: 40vh;
    margin-left: 0;
  }

  #img-login {
    width: 100%;
    max-width: 350px;
    height: auto;
    margin: 0 auto;
  }

  .link-login {
    flex-direction: column;
    margin: 10px 0;
  }

  .a-login {
    margin: 10px 0;
  }
}
</style>
