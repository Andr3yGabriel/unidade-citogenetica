<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import BackButton from '../components/BackButton.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import ExamCard from '../components/ExamCard.vue';
import { Button } from 'primevue';

interface ApiExamResponse {
  id: number;
  data_solicitacao: string;
  patient: {
    id: number;
    completeName: string;
  };
  examStatus: {
    name: string;
    title?: string;
  };
}

interface DisplayExam {
  id: number;
  patient_name: string;
  registrationDate: string;
  status: {
    name: string;
    title?: string;
  };
}

export default defineComponent({
  name: "AllExamsList",
  components: {
    AppHeader,
    AppFooter,
    ExamCard,
    Button,
    BackButton,
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const token = localStorage.getItem("token") || "";
    const exams = ref<DisplayExam[]>([]);

    const fetchExams = async () => {
      if (!token) {
        toast.add({ severity: "error", summary: "Erro de Autenticação", detail: "Sessão expirada ou inválida. Por favor, faça o login novamente." });
        router.push("/login");
        return;
      }

      try {
        const response = await apiClient.get<ApiExamResponse[]>('/exams/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        exams.value = response.data.map((exam: ApiExamResponse) => ({
          id: exam.id,
          patient_name: exam.patient.completeName,
          registrationDate: new Date(exam.data_solicitacao).toLocaleDateString('pt-BR'),
          status: {
            name: exam.examStatus.name,
            title: exam.examStatus.title
          }
        }));

      } catch (error: any) {
        const detail = error.response?.data?.message || "Não foi possível buscar os exames.";
        toast.add({ severity: "error", summary: "Erro de Rede", detail });
      }
    };

    onMounted(fetchExams);

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userId");
    };

    const handleExamClick = (exam: DisplayExam) => {
      localStorage.setItem("selectedExamId", exam.id.toString());
      if (exam.status.title === 'Laudo Disponível') {
        router.push("/result");
      } else {
        router.push("/AddExamFile");
      }
    };

    return {
      exams,
      handleExamClick,
      logout,
    };
  }
});
</script>

<template>
  <div class="page-container">
    <BackButton to="/login" :beforeNavigate="logout" style="position: absolute; top: 130px; left: 15px;" />
    <AppHeader />
    <main id="box-situacao" style="padding-top: 60px;">
      <h1 class="titulo">Situação de Exames</h1>
      <section id="tabela-pacientes">
        <div v-if="exams.length < 1" class="sem-exames">
          <h3>Não há exames a serem exibidos</h3>
        </div>
        <ul>
          <ExamCard
            v-for="exam in exams"
            :key="exam.id"
            :exam="exam"
            @exam-click="handleExamClick(exam)"
          />
        </ul>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#box-situacao {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 10px 0px;
  flex-grow: 1;
}

.titulo {
  color: $dark-gray;
  font-weight: 300;
  font-size: 2.5rem;
}

.sem-exames h3 {
  font-weight: 350;
}

#tabela-pacientes {
  background-color: $background-color;
  display: flex;
  flex-direction: column;
  width: fit-content;
}

ul {
  list-style: none;
  padding: 0;
}
</style>