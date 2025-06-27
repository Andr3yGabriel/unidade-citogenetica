<script lang="ts">
import { Button, Toast, useToast } from "primevue";
import { defineComponent, onMounted, ref } from "vue";
import apiClient from "../axiosConfig";
import router from "../router/router";

interface ApiPatientExamResponse {
  id: number;
  data_solicitacao: string;
  patient: {
    id: number;
    completeName: string;
  };
  examStatus: {
    name: string;
  };
}

// Formato dos dados para exibição na tela
interface DisplayPatientExam {
  id: number;
  patient_name: string;
  registrationDate: string;
  status: string;
}

export default defineComponent({
  // 1. Nome do componente atualizado
  name: "PatientExamsPage",
  components: {
    Button,
    Toast,
  },
  setup() {
    const toast = useToast();
    const token = localStorage.getItem("token") || "";
    const exams = ref<DisplayPatientExam[]>([]);
    const errorMessage = ref<string | null>(null);

    const fetchExams = async () => {
      if (!token) {
        errorMessage.value = "Sessão expirada!";
        toast.add({
          severity: "error",
          summary: "Erro de Autenticação",
          detail: errorMessage.value,
        });
        router.push("/Login");
        return;
      }
      try {
        // A chamada de API para buscar os exames do paciente (identificado pelo token)
        const response = await apiClient.get<ApiPatientExamResponse[]>(`/exams/patient/${localStorage.getItem("userId")}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 2. Lógica simplificada: não precisa mais buscar o nome do paciente
        // O map agora é síncrono e muito mais rápido
        exams.value = response.data.map((exam: ApiPatientExamResponse) => ({
                    id: exam.id,
                    patient_name: exam.patient.completeName,
                    registrationDate: new Date(exam.data_solicitacao).toLocaleDateString('pt-BR'),
                    status: exam.examStatus.name
                }));

      } catch (error) {
        console.error("Erro ao listar exames: ", error);
        errorMessage.value = "Não foi possível carregar seus exames. Tente novamente mais tarde.";
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: errorMessage.value,
        });
      }
    };

    // 3. A função findUserName foi removida, pois não é mais necessária.

    onMounted(() => {
      fetchExams();
    });

    const handleExamClick = (examId: number) => {
            // 5. LÓGICA DE CLIQUE SIMPLIFICADA
            // Para um médico, a ação principal é visualizar o resultado do exame,
            // independentemente do status.
            localStorage.setItem("selectedExamId", examId.toString());
            router.push("/result");
        };

    const goToHome = () => {
      router.push("/");
    };

    return {
      exams,
      errorMessage,
      handleExamClick,
      goToHome,
    };
  },
});
</script>

<template>
  <Toast position="top-left" />
  <nav class="navbar">
    <a @click="goToHome">
      <img
        src="../assets/logo-unidade.jpg"
        alt="Logo da unidade genética com um cromossomo desenhado"
        class="logo"
      />
    </a>
    <span>
      <ion-icon name="person-circle-outline" class="user-profile"></ion-icon>
    </span>
  </nav>
  <main id="box-situacao">
    <h1 class="titulo">Meus Exames</h1>

    <section id="tabela-pacientes">
      <div v-if="exams.length < 1" class="sem-exames">
          <h3>Nenhum exame solicitado foi encontrado.</h3>
      </div>
        <ul>
          <li 
            v-for="exam in exams" 
            :key="exam.id" 
            class="card-lab" 
            :class="{ 'card-pronto': exam.status === 'Laudo Disponível' }"
            @click="handleExamClick(exam.id)"
          >
            <span class="info-paciente">
              <p>{{ exam.patient_name }}</p>
              <p>{{ exam.registrationDate }}</p>
            </span>
            <span class="status">
              <p>{{ exam.status }}</p>
            </span>
          </li>
        </ul>
    </section>
  </main>
  <footer>
      <p>
          Desenvolvido por
          <a href="https://github.com/Andr3yGabriel">Andrey Gonçalves</a> |
          <a href="https://github.com/javu4k">Júlia Peghini</a> |
          <a href="https://github.com/s4abr1na">Sabrina Souza </a> |
          <a href="https://github.com/davih1660">Davi Cruz</a> - 2024
      </p>
  </footer>
</template>

<style lang="scss">

.card-lab {
  cursor: pointer;
}

.card-lab:not(.card-pronto) {
  cursor: default;
}
.navbar {
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  background-color: #0062ae;
}

.logo {
  width: 190px;
  height: 100px;
}

.user-profile {
  height: 50px;
  width: 50px;
  color: white;
  font-weight: 200;
}

#box-situacao {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 10px 0px;

  .titulo {
    color: #6e6e6e;
    font-weight: 300;
    font-size: 2.5rem;
  }
}

.sem-exames {
  h3 {
    font-weight: 350;
  }
}

#tabela-pacientes {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: fit-content;
}

.card-lab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f1dac4;
  width: 800px;
  height: 75px;
  margin: 5px 0px;
  border-radius: 10px;
  padding: 15px;
  text-decoration: none;
}

.card-lab p {
  color: #000;
  font-weight: 500;
}

.card-pronto {
  background-color: #0062ae;
}

.card-pronto p {
  color: white;
}

.bt-home {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f5f5;
  box-shadow: 0px 3px gray;
  border-radius: 22px;
  height: 35px;
  width: 250px;
  margin: 50px 0px;
}

.bt-home a {
  font-style: normal;
  text-decoration: none;
  color: #000;
}

@media (max-width: 1024px) {
  .navbar {
    flex-direction: row;
    padding: 10px;
  }

  .user-profile {
    height: 40px;
    width: 40px;
  }

  #box-situacao .titulo {
    font-size: 2rem;
    text-align: center;
    margin: 20px 0;
  }

  #box-interacao {
    width: 100%;
    align-items: center;
  }

  #bt-add-exame {
    width: 100%;
    max-width: 200px;
    margin: 10px auto;
  }

  #barra-pesquisa {
    width: 100%;
    max-width: 400px;
    margin: 10px auto;
  }

  #barra-pesquisa input {
    width: calc(100% - 40px);
  }

  #filtros {
    width: 100%;
    max-width: 400px;
    margin: 10px auto;
  }

  #filtros p {
    font-size: 1.2rem;
  }

  #tabela-pacientes {
    width: 100%;
  }

  .card-lab,
  .card-pronto {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .bt-home {
    width: 100%;
    max-width: 200px;
    margin: 20px auto;
  }
}
</style>
