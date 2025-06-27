<script lang="ts">
import { Button, Toast, useToast } from 'primevue';
import { defineComponent, onMounted, ref } from 'vue';
import apiClient from '../axiosConfig';
import router from '../router/router';

// 1. (BOA PRÁTICA) Definir interfaces claras para os dados
// O que a API retorna
interface ApiExamResponse {
  id: number;
  data_solicitacao: string;
  patient: {
    id: number;
    completeName: string;
  };
  examStatus: {
    name: string;
  };
  // Adicione outros campos que a API retorna, se necessário
}

// O que vamos usar para exibir na tela
interface DisplayExam {
  id: number;
  patient_name: string;
  registrationDate: string;
  status: string; // Ex: 'Em Análise', 'Laudo Disponível'
}

export default defineComponent({
    name: "AllExamsList",
    components: {
        Button,
        Toast
    },
    setup() {
        const toast = useToast();
        const token = localStorage.getItem("token") || "";
        const userType = localStorage.getItem("userType") || "";

        // O ref agora é tipado com a nossa interface de exibição
        const exams = ref<DisplayExam[]>([]);
        const errorMessage = ref<string | null>(null);
        
        const fetchExams = async () => {
            if (!token) {
                toast.add({ severity: "error", summary: "Erro de Autenticação", detail: "Sessão expirada ou inválida. Por favor, faça o login novamente." });
                router.push("/login"); // Corrigido para uma rota com /
                return;
            }

            try {
                // 2. A CHAMADA DE API CORRETA
                // Usamos o endpoint que retorna todos os exames para técnicos/admins.
                const response = await apiClient.get<ApiExamResponse[]>('/exams/all', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // 3. TRANSFORMAÇÃO DE DADOS SIMPLIFICADA
                // Não há mais 'Promise.all' ou chamadas aninhadas.
                // Mapeamos diretamente a resposta da API para o formato que queremos exibir.
                exams.value = response.data.map((exam: ApiExamResponse) => ({
                    id: exam.id,
                    patient_name: exam.patient.completeName, // Vem direto da API
                    registrationDate: new Date(exam.data_solicitacao).toLocaleDateString('pt-BR'), // Usamos o campo correto
                    status: exam.examStatus.name // Vem direto da API
                }));

            } catch (error: any) {
                console.error("Erro ao listar exames: ", error);
                const detail = error.response?.data?.message || "Não foi possível buscar os exames.";
                toast.add({ severity: "error", summary: "Erro de Rede", detail });
            }
        };
        
        // 4. FUNÇÃO 'findUserName' REMOVIDA
        // Não é mais necessária, pois a API já nos fornece o nome do paciente.
        
        onMounted(() => {
            fetchExams();
        });

        const handleExamClick = (examId: number, status: string) => {
            localStorage.setItem("selectedExamId", examId.toString());
            
            // 5. LÓGICA DE STATUS ATUALIZADA
            // Usamos os novos nomes de status vindos da API.
            // Se o usuário é técnico e o status NÃO é 'Laudo Disponível' ou 'Cancelado', ele pode adicionar o laudo.
            if (userType === "Técnico de Laboratório" && status !== 'Laudo Disponível' && status !== 'Cancelado') {
                router.push("/add-exam-file"); // Corrigido para uma rota com /
            } else {
                // Para todos os outros casos (laudo pronto, outros tipos de usuário), vai para a página de resultado.
                router.push("/result"); // Corrigido para uma rota com /
            }
        };

        const goToHome = () => {
            router.push("/");
        }

        return {
            exams,
            errorMessage,
            handleExamClick,
            goToHome,
        }
    }
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
      <span
        ><ion-icon name="person-circle-outline" class="user-profile"></ion-icon
      ></span>
    </nav>
    <main id="box-situacao">
      <h1 class="titulo">Situação de Exames</h1>

      <section id="tabela-pacientes">
        <div v-if="exams.length < 1" class="sem-exames">
            <h3>Não há exames a serem exibidos</h3>
        </div>
          <ul>
            <li 
              v-for="exam in exams" 
              :key="exam.id" 
              class="card-lab" 
              :class="{ 'card-pronto': exam.status === 'laudo_disponivel' }"
              @click="handleExamClick(exam.id, exam.status)"
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
}

#box-situacao .titulo {
  color: #6e6e6e;
  font-weight: 300;
  font-size: 2.5rem;
}

#box-interacao {
  display: flex;
  justify-content: left;
  align-items: flex-start;
  flex-direction: column;
  width: fit-content;
  background-color: #fff;
  width: 61%;
  margin: 15px 0px 30px 0px;
}

#bt-add-exame {
  background-color: #e2e2e2;
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 2px lightgray;
  margin: 10px 0px;
}

#add-box {
  color: #f2f2f2;
  background-color: #aaaaaa;
  margin-right: 10px;
}

#bt-add-exame p {
  color: #333333;
  opacity: 0.81;
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