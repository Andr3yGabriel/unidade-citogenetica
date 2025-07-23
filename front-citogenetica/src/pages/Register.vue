<script lang="ts">
import { defineComponent, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import apiClient from "../axiosConfig";
import BackButton from '../components/BackButton.vue';
import { Button, FloatLabel, InputText, Password } from "primevue";
import "primeicons/primeicons.css";

export default defineComponent({
  name: "Register",
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
    const completeName = ref<string>("");
    const email = ref<string>("");
    const document = ref<string>("");
    const password = ref<string>("");
    const confirmPassword = ref<string>("");

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        toast.add({ severity: "error", summary: "Erro", detail: "As senhas não coincidem" });
        return;
      }

      try {
        await apiClient.post("/auth/register/patient", {
          completeName: completeName.value,
          password: password.value,
          email: email.value,
          document: document.value
        });
        router.push({ path: "/Login", query: { registered: "true" } });
      } catch (error: any) {
        const detail = error.response?.status === 409 ? "Usuário com esse email já existe!" : "Erro ao registrar usuário!";
        toast.add({ severity: "error", summary: "Erro", detail });
      }
    };

    const goToHome = () => router.push("/");

    return {
      completeName,
      password,
      confirmPassword,
      email,
      document,
      register,
      goToHome,
    };
  },
});
</script>

<template>
  <div id="pagina-registro">
    <Toast position="top-left" />
    <main id="bloco-registro">
      <h1 class="titulo">Registre-se</h1>
      <section id="box-form-registro">
        <div id="inputs">
          <FloatLabel>
            <InputText id="completeName" v-model="completeName" type="text" class="registro-input" size="large" />
            <label for="completeName">Nome Completo</label>
          </FloatLabel>
          <FloatLabel>
            <InputText id="email" v-model="email" type="text" class="registro-input" size="large" />
            <label for="email">Email</label>
          </FloatLabel>
          <FloatLabel>
            <InputText id="document" v-model="document" type="text" class="registro-input" size="large" />
            <label for="document">CPF</label>
          </FloatLabel>
          <FloatLabel>
            <Password id="password" v-model="password" :feedback="false" toggleMask fluid />
            <label for="password">Senha</label>
          </FloatLabel>
          <FloatLabel>
            <Password id="confirmPassword" v-model="confirmPassword" :feedback="false" toggleMask fluid />
            <label for="confirmPassword">Confirmar Senha</label>
          </FloatLabel>
        </div>
        <Button @click="register" label="Registrar" severity="secondary" id="submit-registro" rounded />
      </section>
    </main>
    <aside id="bloco-imagem-registro">
      <BackButton to="/Login" style="position: fixed; top: 30px; right: 30px;" />
      <img src="../assets/cadastro.png" alt="Mulher sentada em frente a um celular" id="imagem-registro" />
    </aside>
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

#pagina-registro {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#bloco-registro {
  display: flex;
  flex-direction: column;
  background-color: $primary-color;
  width: 55%;
  height: 100vh;
  align-items: center;
  justify-content: center;

  .titulo {
    font-weight: 300;
    color: $light-gray;
  }

  #box-form-registro {
    display: flex;
    flex-direction: column;
    background-color: $primary-color;
    width: 100%;
    padding: 0;
    align-items: center;
    justify-content: center;
    gap: 20px;

    #inputs {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 25px;
    }

    #submit-registro {
      width: 100px;
      height: 32px;
      background-color: $light-gray;
      box-shadow: 0px 2px gray;
      transition: .2s;

      &:hover {
        box-shadow: 1px 3px gray;
      }
    }
  }
}

#bloco-imagem-registro {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45%;

  .bt-voltar {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: $light-gray;
    box-shadow: 0px 2px gray;
    border-radius: 22px;
    height: 35px;
    width: 100px;
  }

  #imagem-registro {
    height: 80%;
    width: 80%;
  }
}

@media (max-width: 1024px) {
  #container-registro {
    flex-direction: column;
    align-items: center;
  }

  #bloco-registro {
    width: 100%;
    height: auto;
    padding: 20px;
  }

  #form-registro {
    width: 90%;
    max-width: 350px;
  }

  .registro-input {
    width: 100%;
    max-width: 350px;
  }

  #imagem-registro {
    width: 100%;
    max-width: 350px;
    height: auto;
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: 20px;
  }

  .bt-voltar {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 20px;
  }
}
</style>