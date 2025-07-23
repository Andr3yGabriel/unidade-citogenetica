<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import apiClient from "../axiosConfig";
import BackButton from '../components/BackButton.vue';
import { Button, FloatLabel, InputText, Password } from "primevue";
import 'primeicons/primeicons.css';

export default defineComponent({
  name: "Login",
  components: {
    Button,
    InputText,
    FloatLabel,
    Password,
    BackButton,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const document = ref<string>("");
    const password = ref<string>("");

    onMounted(() => {
      if (router.currentRoute.value.query.registered === "true") {
        toast.add({ severity: "success", summary: "Sucesso", detail: "Usuário registrado com sucesso!" });
        router.replace({ query: { registered: undefined } });
      }
    });

    const login = async () => {
      try {
        const response = await apiClient.post("/auth/login", {
          document: document.value,
          password: password.value,
        });

        const { token, userType, userId } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userType", userType.toString());
        localStorage.setItem("userId", userId.toString());

        goToList(userType);
      } catch (error: any) {
        const detail = error.response?.status === 404 ? "Usuário não encontrado" : "Erro ao fazer login!";
        toast.add({ severity: "error", summary: "Erro", detail });
      }
    };

    const goToRegister = () => router.push("/Register");
    const goToHome = () => router.push("/");
    const goToForget = () => router.push("/ForgetPassword");

    const goToList = (userType: string) => {
      switch (userType) {
        case "paciente":
          router.push("/PatientList");
          break;
        case "tecnico":
          router.push("/AllExamsList");
          break;
        case "admin":
          router.push("/AdminList");
          break;
        case "medico":
          router.push("/DoctorList");
          break;
        default:
          toast.add({ severity: "error", summary: "Erro", detail: "Tipo de usuário inválido" });
      }
    };

    return {
      document,
      password,
      login,
      goToHome,
      goToRegister,
      goToForget
    };
  },
});
</script>

<template>
  <div id="container-login">
    <Toast position="top-left" />
    <aside id="bloco-imagem-login">
      <BackButton to="/" style="position: fixed; top: 30px; left: 30px;" />
      <div id="img-login-div">
        <img id="img-login" src="../assets/login.png" />
      </div>
    </aside>

    <main id="bloco-texto-login">
      <h1 id="titulo-login">Faça seu Login</h1>
      <section id="box-form-login">
        <FloatLabel variant="on">
          <InputText v-tooltip="'Insira seu CPF (Somente números)'" id="document" v-model="document" type="text"
            class="login-input" size="large" />
          <label for="document">CPF</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <Password v-tooltip="'Insira sua senha'" id="password" v-model="password" type="password" :feedback="false"
            toggleMask fluid />
          <label for="document">Senha</label>
        </FloatLabel>

        <div class="link-login">
          <a class="a-login" @click="goToRegister">Cadastre-se</a>
          <a class="a-login" @click="goToForget">Esqueci minha senha</a>
        </div>

        <Button @Click="login" label="Entrar" severity="secondary" rounded />
      </section>
    </main>
  </div>
</template>

<style lang="scss">
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