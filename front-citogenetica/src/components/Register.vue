<script lang="ts">
import axios, { AxiosError } from "axios";
import {
  Button,
  FloatLabel,
  InputText,
  Password,
  Toast,
  useToast,
} from "primevue";
import { defineComponent, ref } from "vue";
import apiClient from "../axiosConfig";
import router from "../router/router";
import "primeicons/primeicons.css";

export default defineComponent({
  name: "Register",
  components: {
    Toast,
    Button,
    InputText,
    FloatLabel,
    Password,
  },

  setup() {
    const toast = useToast();
    const completeName = ref<string>("");
    const email = ref<string>("");
    const document = ref<string>("");
    const password = ref<string>("");
    const confirmPassword = ref<string>("");
    const errorMessage = ref<string>("");

    const register = async () => {
      try {
        if (password.value !== confirmPassword.value) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: "As senhas não coincidem",
          });
          return;
        }

        const payload = {
          completeName: completeName.value,
          password: password.value,
          email: email.value,
          document: document.value
        };

        const response = await apiClient.post("/auth/register/patient", payload );

        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("userType", response.data.userType.toString());
        goToList();
      } catch (error) {
        console.error("Error at user register!", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 409) {
            errorMessage.value = "Usuário com esse email já existe!";
          } else {
            errorMessage.value = "Error at user register!";
          }
        } else {
          errorMessage.value = "Error at user register!";
        }
        toast.add({
          severity: "error",
          summary: "Error",
          detail: errorMessage.value,
        });
      }
    };

    const goToList = () => {
      router.push("PatientList")
    };

    const goToHome = () => {
      router.push("/");
    };

    return {
      toast,
      completeName,
      password,
      confirmPassword,
      email,
      document,
      errorMessage,
      register,
      goToList,
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
          <FloatLabel variant="on">
            <InputText
              v-tooltip="'Insira seu nome completo'"
              id="completeName"
              v-model="completeName"
              type="text"
              class="registro-input"
              style="color: black"
              size="large"
            />
            <label for="completeName">Nome Completo</label>
          </FloatLabel>
  
          <FloatLabel variant="on">
            <InputText
              v-tooltip="'Insira seu email'"
              id="email"
              v-model="email"
              type="text"
              class="registro-input"
              style="color: black"
              size="large"
            />
            <label for="email">Email</label>
          </FloatLabel>
  
          <FloatLabel variant="on">
            <InputText
              v-tooltip="'Insira seu CPF (Somente números)'"
              id="document"
              v-model="document"
              type="text"
              class="registro-input"
              style="color: black"
              size="large"
            />
            <label for="document">CPF</label>
          </FloatLabel>
  
          <FloatLabel variant="on">
            <Password
              v-tooltip="'Insira sua senha'"
              id="password"
              v-model="password"
              type="password"
              :feedback="false"
              class="registro-input"
              style="color: black"
              toggleMask
              fluid
            />
            <label for="password">Senha</label>
          </FloatLabel>
  
          <FloatLabel variant="on">
            <Password
              v-tooltip="'Confirme sua senha'"
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              :feedback="false"
              class="registro-input"
              style="color: black"
              toggleMask
              fluid
            />
            <label for="confirmPassword">Confirmar Senha</label>
          </FloatLabel>
        </div>

        <Button
          @Click="register"
          label="Entrar"
          severity="secondary"
          id="submit-registro"
          rounded
        />
      </section>
    </main>

    <!-- Box com a imagem e o botão para voltar -->
    <aside id="bloco-imagem-registro">
      <Button
        @Click="goToHome"
        icon="pi pi-chevron-left"
        style="color: black"
        label="Voltar"
        severity="secondary"
        class="bt-voltar"
        rounded
      />
      <img
        src="../assets/cadastro.png"
        alt="Mulher sentada em frente a um celular"
        id="imagem-registro"
      />
    </aside>
  </div>
</template>

<style lang="scss">
#pagina-registro {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#bloco-registro {
  display: flex;
  flex-direction: column;
  background-color: #0062ae;
  width: 55%;
  height: 100vh;
  align-items: center;
  justify-content: center;

  .titulo {
    font-weight: 300;
    color: #f8f5f5;
  }

  #box-form-registro {
    display: flex;
    flex-direction: column;
    background-color: #0062ae;
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
      gap: 10px;
    }

    #submit-registro {
      width: 100px;
      height: 32px;
      background-color: #f8f5f5;
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
    background-color: #f8f5f5;
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
