<script lang="ts">
import { Button, Toast, useToast } from 'primevue';
import { defineComponent, onMounted, ref } from 'vue';
import apiClient from '../axiosConfig';
import router from '../router/router';

interface ApiDoctorExamResponse {
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

interface DisplayDoctorExam {
  id: number;
  patient_name: string;
  registrationDate: string;
  status: string;
}

export default defineComponent({
    name: "DoctorList",
    components: {
        Button,
        Toast
    },
    setup() {
        const toast = useToast();
        const token = localStorage.getItem("token") || "";
        const userType = localStorage.getItem("userType") || "";
        const userId = localStorage.getItem("userId") || "";
        
        const exams = ref<DisplayDoctorExam[]>([]);
        const userName = ref<string>("Carregando...");
        const userTypeLabel = ref<string>("");
        const showDropdown = ref(false);

        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                userName.value = response.data.completeName || response.data.email || "Usuário";
            } catch (error) {
                console.error("Erro ao buscar info do usuário:", error);
                userName.value = "Usuário";
            }

            const typeMap: Record<string, string> = {
                'medico': 'Médico',
                'tecnico': 'Técnico',
                'admin': 'Administrador',
                'paciente': 'Paciente'
            };
            userTypeLabel.value = typeMap[userType] || userType;
        };

        const fetchExams = async () => {
            if (!token) {
                toast.add({ severity: "error", summary: "Erro de Autenticação", detail: "Sessão expirada. Faça o login novamente." });
                router.push("/login");
                return;
            }

            try {
                const response = await apiClient.get<ApiDoctorExamResponse[]>(`/exams/doctor/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                exams.value = response.data.map((exam: ApiDoctorExamResponse) => ({
                    id: exam.id,
                    patient_name: exam.patient.completeName,     
                    registrationDate: new Date(exam.data_solicitacao).toLocaleDateString('pt-BR'),
                    status: exam.examStatus.name
                }));
            } catch (error: any) {
                console.error("Erro ao listar exames do médico: ", error);
                const detail = error.response?.data?.message || "Não foi possível buscar os exames.";
                toast.add({ severity: "error", summary: "Erro de Rede", detail });
            }
        };

        onMounted(() => {
            fetchUserInfo();
            fetchExams();
        });

        const handleExamClick = (examId: number) => {
            localStorage.setItem("selectedExamId", examId.toString());
            router.push("/result");
        };

        const goToHome = () => {
            router.push("/");
        };

        const goToNewExam = () => {
            router.push("/RequestExam");
        };

        const goToBuscaPaciente = () => {
            router.push("/BuscaPaciente");
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

        return {
            exams,
            handleExamClick,
            goToHome,
            goToNewExam,
            goToBuscaPaciente,
            userName,
            userTypeLabel,
            showDropdown,
            toggleDropdown,
            logout,
            formatStatus,
        }
    }
});
</script>

<template>
    <Toast position="top-right" />
    
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
              <span>{{ userTypeLabel }}</span>
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
          <h1>Meus Exames Solicitados</h1>
        </div>

        <!-- Botões de Ação -->
        <div class="action-buttons">
          <Button 
            label="Novo Exame" 
            icon="pi pi-plus"
            class="p-button-primary"
            @click="goToNewExam"
          />
          <Button 
            label="Buscar Paciente" 
            icon="pi pi-search"
            class="p-button-outlined"
            @click="goToBuscaPaciente"
          />
        </div>

        <!-- Lista de Exames -->
        <div class="exams-container">
          <div v-if="exams.length === 0" class="no-exams">
            <i class="pi pi-inbox" style="font-size: 3rem; color: #94a3b8;"></i>
            <h3>Nenhum exame solicitado</h3>
            <p>Você ainda não solicitou nenhum exame.</p>
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
                <i class="pi pi-user"></i>
                <span>{{ exam.patient_name }}</span>
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

/* Dropdown Menu */
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
  margin: 0;
}

/* Botões de Ação */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
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