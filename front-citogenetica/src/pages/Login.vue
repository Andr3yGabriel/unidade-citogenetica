<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import apiClient from "../axiosConfig";
import BackButton from "../components/BackButton.vue";
import { Button, FloatLabel, InputText, Password } from "primevue";
import "primeicons/primeicons.css";

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
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário registrado com sucesso!",
        });
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
        const detail =
          error.response?.status === 404
            ? "Usuário não encontrado"
            : "Erro ao fazer login!";
        toast.add({ severity: "error", summary: "Erro", detail });
      }
    };

    const goToRegister = () => router.push("/Register");
    const goToHome = () => router.push("/");
    const goToForget = () => router.push("/ForgetPassword");

    const listChoices: { [key: string]: string } = {
      paciente: "/PatientList",
      tecnico: "/AllExamsList",
      admin: "/AdminList",
      medico: "/DoctorList",
    };

    const goToList = (userType: string) => {
      const route = listChoices[userType];
      if (route) {
        router.push(route);
        toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Login realizado com sucesso!",
        });
      } else {
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Tipo de usuário inválido",
        });
      }
    };

    return {
      document,
      password,
      login,
      goToHome,
      goToRegister,
      goToForget,
    };
  },
});
</script>

<template>
  <div id="container-login">

    <!-- PAINEL ESQUERDO: Identidade institucional -->
    <aside id="painel-institucional">
      <div class="painel-deco">
        <div class="circulo c1"></div>
        <div class="circulo c2"></div>
        <div class="circulo c3"></div>
        <div class="circulo c4"></div>
      </div>

      <div class="painel-conteudo">
        <!-- Botão voltar integrado ao painel azul -->
        <button class="btn-voltar-painel" @click="goToHome">
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span>Voltar ao início</span>
        </button>

        <div class="painel-texto">
          <p class="painel-label">Sistema de Gestão</p>
          <h1 class="painel-titulo">Unidade de<br />Genética</h1>
          <p class="painel-subtitulo">UGEN · DF</p>
          <p class="painel-desc">
            Portal de acesso ao sistema integrado de gerenciamento de exames
            genéticos da Secretaria de Saúde do Distrito Federal.
          </p>
        </div>

        <div class="painel-rodape">
          <p>Hospital de Apoio de Brasília</p>
          <p>Secretaria de Saúde do DF</p>
        </div>
      </div>
    </aside>

    <!-- PAINEL DIREITO: Formulário -->
    <main id="painel-form">
      <div class="form-wrapper">
        <div class="form-header">
          <div class="form-icone">
            <ion-icon name="lock-closed-outline"></ion-icon>
          </div>
          <h2 class="form-titulo">Acesso ao Sistema</h2>
          <p class="form-subtitulo">Insira suas credenciais para continuar</p>
        </div>

        <section id="box-form-login">
          <div class="campo-grupo">
            <FloatLabel variant="on">
              <InputText
                v-tooltip="'Insira seu CPF (somente números)'"
                id="document"
                v-model="document"
                type="text"
                class="login-input"
                size="large"
              />
              <label for="document">CPF</label>
            </FloatLabel>
          </div>

          <div class="campo-grupo">
            <FloatLabel variant="on">
              <Password
                v-tooltip="'Insira sua senha'"
                id="password"
                v-model="password"
                :feedback="false"
                toggleMask
                fluid
              />
              <label for="password">Senha</label>
            </FloatLabel>
          </div>

          <div class="link-login">
            <a class="a-login" @click="goToForget">Esqueci minha senha</a>
          </div>

          <Button
            @click="login"
            label="Entrar"
            class="btn-entrar"
            rounded
          />

          <div class="cadastro-link">
            <span>Não tem conta?</span>
            <a class="a-login-cadastro" @click="goToRegister">Cadastre-se</a>
          </div>
        </section>
      </div>
    </main>

  </div>
</template>

<style lang="scss">
/* ==============================
   LAYOUT PRINCIPAL
============================== */
#container-login {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* ==============================
   PAINEL ESQUERDO
============================== */
#painel-institucional {
  position: relative;
  width: 48%;
  height: 100%;
  background: linear-gradient(155deg, #003d75 0%, #0062ae 50%, #1a7fcb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

/* Círculos decorativos */
.painel-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circulo {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
}

.c1 {
  width: 480px;
  height: 480px;
  top: -120px;
  right: -160px;
}

.c2 {
  width: 320px;
  height: 320px;
  top: -60px;
  right: -100px;
  border-color: rgba(255, 255, 255, 0.07);
}

.c3 {
  width: 380px;
  height: 380px;
  bottom: -140px;
  left: -160px;
  border-color: rgba(255, 255, 255, 0.08);
}

.c4 {
  width: 180px;
  height: 180px;
  bottom: 80px;
  right: 40px;
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.12);
}

/* Conteúdo do painel */
.painel-conteudo {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 40px 52px;
  color: #fff;
}

/* Botão voltar integrado ao painel azul */
.btn-voltar-painel {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  width: fit-content;

  ion-icon {
    font-size: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
}

.painel-texto {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.painel-label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.painel-titulo {
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.1;
  color: #fff;
  margin: 8px 0 4px;
  letter-spacing: -0.01em;
}

.painel-subtitulo {
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.15em;
  margin: 0;
}

.painel-desc {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.65;
  margin-top: 20px;
  max-width: 340px;
}

.painel-rodape {
  display: flex;
  flex-direction: column;
  gap: 2px;

  p {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.45);
    margin: 0;
    letter-spacing: 0.04em;
  }
}

/* ==============================
   PAINEL DIREITO (FORM)
============================== */
#painel-form {
  flex: 1;
  background-color: #f5f8fc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
}

.form-wrapper {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.form-icone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background-color: #e3efff;
  border-radius: 12px;
  color: #0062ae;
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.form-titulo {
  font-size: 1.65rem;
  font-weight: 700;
  color: #0d2a45;
  margin: 0;
  letter-spacing: -0.01em;
}

.form-subtitulo {
  font-size: 0.9rem;
  color: #7a94b0;
  margin: 0;
}

/* ==============================
   FORMULÁRIO
============================== */
#box-form-login {
  display: flex;
  flex-direction: column;
  gap: 18px;

  .campo-grupo {
    width: 100%;

    /* Override PrimeVue para harmonia visual */
    .p-inputtext,
    .p-password-input {
      width: 100%;
      border-radius: 10px;
      border-color: #d0dff0;
      background-color: #fff;
      font-size: 0.95rem;
      padding: 14px 14px;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        border-color: #0062ae;
        box-shadow: 0 0 0 3px rgba(0, 98, 174, 0.12);
      }
    }

    .p-password {
      width: 100%;
    }
  }

  .link-login {
    display: flex;
    justify-content: flex-end;
    margin-top: -6px;

    .a-login {
      font-size: 0.85rem;
      color: #0062ae;
      text-decoration: none;
      cursor: pointer;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: #003d75;
        text-decoration: underline;
      }
    }
  }

  .btn-entrar {
    width: 100%;
    padding: 14px;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    background-color: #0062ae !important;
    border-color: #0062ae !important;
    color: #fff !important;
    border-radius: 10px !important;
    transition: background-color 0.2s, transform 0.15s;

    &:hover {
      background-color: #004f90 !important;
      border-color: #004f90 !important;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .cadastro-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 4px;

    span {
      font-size: 0.88rem;
      color: #7a94b0;
    }

    .a-login-cadastro {
      font-size: 0.88rem;
      color: #0062ae;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: #003d75;
        text-decoration: underline;
      }
    }
  }
}

/* ==============================
   RESPONSIVO
============================== */
@media (max-width: 900px) {
  #container-login {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }

  #painel-institucional {
    width: 100%;
    height: auto;
    min-height: 200px;
    padding: 0;
  }

  .painel-conteudo {
    padding: 28px 28px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 20px;
    height: auto;
    justify-content: space-between;
  }

  .btn-voltar-painel {
    order: -1;
    width: 100%;
  }

  .painel-texto {
    flex: 1;
    min-width: 200px;
    gap: 4px;
  }

  .painel-titulo {
    font-size: 2rem;
  }

  .painel-desc,
  .painel-rodape {
    display: none;
  }

  #painel-form {
    padding: 40px 28px;
    justify-content: center;
  }

  .form-wrapper {
    max-width: 440px;
  }
}

@media (max-width: 480px) {
  .painel-titulo {
    font-size: 1.6rem;
  }

  .painel-label,
  .painel-subtitulo {
    display: none;
  }

  #painel-form {
    padding: 60px 20px 32px;
  }
}
</style>