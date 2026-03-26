<script lang="ts">
import { Button, Toast, useToast, Dropdown } from "primevue";
import { defineComponent, onMounted, ref, computed } from "vue";
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

interface DisplayPatientExam {
  id: number;
  patient_name: string;
  registrationDate: string;
  status: string;
}

interface FilterOption {
  label: string;
  value: string;
}

export default defineComponent({
  name: "PatientExamsPage",
  components: {
    Button,
    Toast,
    Dropdown
  },
  setup() {
    const toast = useToast();
    const token = localStorage.getItem("token") || "";
    const userId = localStorage.getItem("userId") || "";
    
    const exams = ref<DisplayPatientExam[]>([]);
    const allExams = ref<DisplayPatientExam[]>([]);
    const errorMessage = ref<string | null>(null);
    const userName = ref<string>("Carregando...");
    const showDropdown = ref(false);

    // Filtro
    const selectedFilter = ref<string>("todos");
    const filterOptions = ref<FilterOption[]>([
      { label: "Todos os Exames", value: "todos" },
      { label: "Solicitados", value: "solicitado" },
      { label: "Laudo Disponível", value: "laudo_disponivel" }
    ]);

    const fetchUserInfo = async () => {
      try {
        const response = await apiClient.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        userName.value = response.data.completeName || response.data.email || "Paciente";
      } catch (error) {
        console.error("Erro ao buscar info do usuário:", error);
        userName.value = "Paciente";
      }
    };

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
        const patientId = localStorage.getItem("selectedPatientId") || userId;
        const response = await apiClient.get<ApiPatientExamResponse[]>(`/exams/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        allExams.value = response.data.map((exam: ApiPatientExamResponse) => ({
          id: exam.id,
          patient_name: exam.patient.completeName,
          registrationDate: new Date(exam.data_solicitacao).toLocaleDateString('pt-BR'),
          status: exam.examStatus.name
        }));

        applyFilter();

      } catch (error) {
        console.error("Erro ao listar exames: ", error);
        errorMessage.value = "Não foi possível carregar seus exames.";
        toast.add({
          severity: "error",
          summary: "Erro",
          detail: errorMessage.value,
        });
      }
    };

    const applyFilter = () => {
      if (selectedFilter.value === "todos") {
        exams.value = allExams.value;
      } else {
        exams.value = allExams.value.filter(exam => exam.status === selectedFilter.value);
      }
    };

    const examCounts = computed(() => {
      return {
        total: allExams.value.length,
        solicitado: allExams.value.filter(e => e.status === 'solicitado').length,
        laudo_disponivel: allExams.value.filter(e => e.status === 'laudo_disponivel').length
      };
    });

    onMounted(async () => {
      await fetchUserInfo();
      await fetchExams();
    });

    const handleExamClick = (examId: number) => {
      localStorage.setItem("selectedExamId", examId.toString());
      router.push("/result");
    };

    const goToHome = () => {
      router.push("/");
    };

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const logout = () => {
      localStorage.clear();
      toast.add({
        severity: "success",
        summary: "Logout realizado",
        detail: "Você foi desconectado com sucesso."
      });
      router.push("/login");
    };

    const formatStatus = (status: string) => {
      return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };

    const onFilterChange = () => {
      applyFilter();
    };

    return {
      exams,
      errorMessage,
      handleExamClick,
      goToHome,
      userName,
      showDropdown,
      toggleDropdown,
      logout,
      formatStatus,
      selectedFilter,
      filterOptions,
      onFilterChange,
      examCounts
    };
  },
});
</script>

<template>
  <Toast position="top-right" :life="5000" />

  <!-- Navbar -->
  <nav class="navbar">
    <a @click="goToHome" style="cursor: pointer;">
      <img
        src="../assets/logo-unidade.jpg"
        alt="Logo da unidade genética"
        class="logo"
      />
    </a>

    <!-- Dropdown de Perfil -->
    <div class="user-menu-wrapper">
      <button @click="toggleDropdown" class="user-button">
        <ion-icon name="person-circle-outline" class="user-profile"></ion-icon>
      </button>

      <div v-if="showDropdown" class="dropdown-menu">
        <div class="dropdown-header">
          <div class="user-info">
            <i class="pi pi-user"></i>
            <span class="user-name">{{ userName }}</span>
          </div>
          <div class="user-role">
            <i class="pi pi-id-card"></i>
            <span>Paciente</span>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <button @click="logout" class="dropdown-item logout">
          <i class="pi pi-sign-out"></i>
          <span>Sair</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Container Principal -->
  <div class="page-container" @click="showDropdown = false">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="page-header">
        <h1>Meus Exames</h1>
        <p class="subtitle">
          {{ examCounts.total }} exames • 
          {{ examCounts.solicitado }} pendentes • 
          {{ examCounts.laudo_disponivel }} concluídos
        </p>
      </div>

      <!-- Filtro -->
      <div class="controls-row">
        <div class="filter-container">
          <label for="statusFilter">Filtrar por status:</label>
          <Dropdown 
            id="statusFilter"
            v-model="selectedFilter" 
            :options="filterOptions" 
            optionLabel="label" 
            optionValue="value"
            @change="onFilterChange"
            class="status-dropdown"
          />
        </div>
      </div>

      <!-- Lista de Exames -->
      <div class="exams-container">
        <div v-if="exams.length === 0" class="no-exams">
          <i class="pi pi-inbox" style="font-size: 3rem; color: #94a3b8;"></i>
          <h3>Nenhum exame encontrado</h3>
          <p v-if="selectedFilter !== 'todos'">
            Não há exames com o filtro selecionado.
          </p>
          <p v-else>Você ainda não possui exames cadastrados.</p>
        </div>

        <div 
          v-for="exam in exams" 
          :key="exam.id"
          class="exam-card"
          :class="{ 'exam-completed': exam.status === 'laudo_disponivel' }"
          @click="handleExamClick(exam.id)"
        >
          <div class="exam-info">
            <div class="patient-name">
              <i class="pi pi-file-edit"></i>
              <span>Exame de {{ exam.patient_name }}</span>
            </div>
            <div class="exam-date">
              <i class="pi pi-calendar"></i>
              <span>{{ exam.registrationDate }}</span>
            </div>
          </div>
          <div class="exam-status">
            <span class="status-badge">{{ formatStatus(exam.status) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Navbar */
.navbar {
  display: flex;
  padding: 10px 20px;
  align-items: center;
  justify-content: space-between;
  background-color: #0062ae;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.logo {
  width: 190px;
  height: 100px;
  cursor: pointer;
}

/* User Menu */
.user-menu-wrapper {
  position: relative;
}

.user-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.user-profile {
  height: 50px;
  width: 50px;
  color: white;
  font-weight: 200;
  transition: transform 0.2s ease;
}

.user-button:hover .user-profile {
  transform: scale(1.1);
}

.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 1.25rem;
  background: linear-gradient(135deg, #0062ae 0%, #004a87 100%);
  border-radius: 8px 8px 0 0;
  color: white;
}

.user-info,
.user-role {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.user-role {
  margin-bottom: 0;
  opacity: 0.9;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
}

.user-info i,
.user-role i {
  font-size: 1.1rem;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0;
}

.dropdown-item {
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  transition: background 0.2s ease;
  border-radius: 0 0 8px 8px;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.logout {
  color: #dc2626;
}

.dropdown-item i {
  font-size: 1.1rem;
}

/* Container Principal */
.page-container {
  min-height: calc(100vh - 120px);
  background-color: #f8fafc;
  padding: 2rem 1rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  color: #1e293b;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

/* Controls Row */
.controls-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-container label {
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.status-dropdown {
  min-width: 200px;
}

/* Container de Exames */
.exams-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Sem Exames */
.no-exams {
  background: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.no-exams h3 {
  color: #475569;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
}

.no-exams p {
  color: #94a3b8;
  margin: 0;
}

/* Card de Exame */
.exam-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #f1dac4;
}

.exam-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.exam-completed {
  border-left-color: #10b981;
  background: linear-gradient(to right, #ecfdf5 0%, white 100%);
}

.exam-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.patient-name,
.exam-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
}

.patient-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.patient-name i,
.exam-date i {
  color: #94a3b8;
  font-size: 1rem;
}

.exam-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #fef3c7;
  color: #92400e;
}

.exam-completed .status-badge {
  background-color: #d1fae5;
  color: #065f46;
}

/* Responsivo */
@media (max-width: 768px) {
  .navbar {
    padding: 10px;
  }

  .logo {
    width: 150px;
    height: 80px;
  }

  .user-profile {
    height: 40px;
    width: 40px;
  }

  .dropdown-menu {
    right: -10px;
  }

  .page-container {
    padding: 1rem 0.5rem;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }

  .controls-row {
    justify-content: stretch;
  }

  .filter-container {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .status-dropdown {
    width: 100%;
  }

  .exam-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .exam-status {
    width: 100%;
  }

  .status-badge {
    width: 100%;
    text-align: center;
  }
}
</style>