<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import { Button, Toast, FileUpload } from 'primevue';

interface ExamData {
    id: number;
    patient: {
        id: number;
        completeName: string;
        document: string;
        sesNumber: string;
        dateOfBirth?: string;
        motherName?: string;
        email: string;
    };
    requestingDoctor: {
        id: number;
        completeName: string;
    };
    examType: {
        id: number;
        name: string;
    };
    examStatus: {
        id: number;
        name: string;
    };
    data_solicitacao: string;
}

export default defineComponent({
    name: "AddExamFile",
    components: {
        FileUpload,
        Button,
        Toast
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const token = localStorage.getItem("token") || "";
        const userId = localStorage.getItem("userId") || "";
        const examId = localStorage.getItem("selectedExamId") || "";
        
        const file = ref<File | null>(null);
        const uploading = ref(false);
        const loading = ref(true);
        const examData = ref<ExamData | null>(null);
        const userName = ref<string>("Carregando...");
        const userTypeLabel = ref<string>("Técnico");
        const showDropdown = ref(false);

        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                userName.value = response.data.completeName || response.data.email || "Técnico";
            } catch (error) {
                console.error("Erro ao buscar info do usuário:", error);
                userName.value = "Técnico";
            }
        };

        const fetchExamData = async () => {
            try {
                const response = await apiClient.get(`/exams/${examId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                examData.value = response.data;
            } catch (error: any) {
                console.error("Erro ao buscar dados do exame:", error);
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Não foi possível carregar os dados do exame."
                });
                router.push("/AllExamsList");
            } finally {
                loading.value = false;
            }
        };

        onMounted(async () => {
            if (!examId) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Nenhum exame selecionado!"
                });
                router.push("/AllExamsList");
                return;
            }
            await fetchUserInfo();
            await fetchExamData();
        });

        const handleFileUpload = (event: any) => {
            if (event.files && event.files.length > 0) {
                file.value = event.files[0];
            }
        };

        const formatCPF = (cpf: string) => {
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        };

        const formatStatus = (status: string) => {
            return status
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        };

        const handleSubmit = async () => {
            if (!file.value) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Por favor, selecione um arquivo PDF."
                });
                return;
            }

            uploading.value = true;

            try {
                const formData = new FormData();
                formData.append('laudoFile', file.value);

                const response = await apiClient.post(`/reports/upload/${examId}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Laudo enviado com sucesso!"
                    });
                    
                    setTimeout(() => {
                        router.push("/AllExamsList");
                    }, 1000);
                }
            } catch (error: any) {
                console.error("Erro ao enviar laudo: ", error);
                const message = error.response?.data?.message || "Erro ao enviar laudo!";
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: message
                });
            } finally {
                uploading.value = false;
            }
        };

        const handleCancel = () => {
            router.push("/AllExamsList");
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

        return {
            file,
            uploading,
            loading,
            examData,
            userName,
            userTypeLabel,
            showDropdown,
            handleFileUpload,
            handleSubmit,
            handleCancel,
            goToHome,
            toggleDropdown,
            logout,
            formatCPF,
            formatStatus
        };
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
        <!-- Loading -->
        <div v-if="loading" class="loading-container">
          <i class="pi pi-spin pi-spinner" style="font-size: 3rem; color: #0062ae;"></i>
          <p>Carregando dados do exame...</p>
        </div>

        <!-- Conteúdo -->
        <div v-else>
          <!-- Header -->
          <div class="page-header">
            <h1>Adicionar Laudo ao Exame</h1>
            <p class="subtitle">Verifique os dados e faça upload do laudo em PDF</p>
          </div>

          <!-- Informações do Exame e Paciente -->
          <div class="info-card" v-if="examData">
            <div class="info-header">
              <i class="pi pi-info-circle"></i>
              <h3>Informações do Exame</h3>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <label>Paciente:</label>
                <span class="info-value">{{ examData.patient.completeName }}</span>
              </div>

              <div class="info-item">
                <label>CPF:</label>
                <span class="info-value">{{ formatCPF(examData.patient.document) }}</span>
              </div>

              <div class="info-item" v-if="examData.patient.sesNumber">
                <label>Número SES:</label>
                <span class="info-value">{{ examData.patient.sesNumber }}</span>
              </div>

              <div class="info-item" v-if="examData.patient.dateOfBirth">
                <label>Data de Nascimento:</label>
                <span class="info-value">{{ new Date(examData.patient.dateOfBirth).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) }}</span>
              </div>

              <div class="info-item" v-if="examData.patient.motherName">
                <label>Nome da mãe:</label>
                <span class="info-value">{{ examData.patient.motherName }}</span>
              </div>

              <div class="info-item">
                <label>E-mail:</label>
                <span class="info-value">{{ examData.patient.email }}</span>
              </div>

              <div class="info-item">
                <label>Tipo de Exame:</label>
                <span class="info-value">{{ formatStatus(examData.examType.name) }}</span>
              </div>

              <div class="info-item">
                <label>Médico Solicitante:</label>
                <span class="info-value">{{ examData.requestingDoctor.completeName }}</span>
              </div>

              <div class="info-item">
                <label>Status Atual:</label>
                <span class="status-badge">{{ formatStatus(examData.examStatus.name) }}</span>
              </div>

              <div class="info-item">
                <label>Data da Solicitação:</label>
                <span class="info-value">{{ new Date(examData.data_solicitacao).toLocaleDateString('pt-BR') }}</span>
              </div>
            </div>
          </div>

          <!-- Upload do Laudo -->
          <div class="upload-card">
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="arquivo">
                  <i class="pi pi-file-pdf"></i>
                  Arquivo do Laudo (PDF)
                </label>
                <FileUpload 
                  id="arquivo" 
                  mode="basic" 
                  name="laudoFile" 
                  accept="application/pdf" 
                  :maxFileSize="10000000"
                  chooseLabel="Selecionar PDF"
                  @select="handleFileUpload"
                  :auto="false"
                  class="file-upload-custom"
                />
                <small class="file-info">
                  <i class="pi pi-info-circle"></i>
                  Tamanho máximo: 10MB. Apenas arquivos PDF são permitidos.
                </small>
              </div>

              <div class="button-group">
                <Button 
                  type="submit" 
                  label="Enviar Laudo" 
                  icon="pi pi-upload"
                  :loading="uploading"
                  :disabled="!file || uploading"
                  class="p-button-success"
                />
                <Button 
                  type="button" 
                  label="Cancelar" 
                  icon="pi pi-times"
                  class="p-button-secondary"
                  @click="handleCancel"
                  :disabled="uploading"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
/* Navbar (igual aos outros) */
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
  max-width: 900px;
  margin: 0 auto;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.loading-container p {
  color: #64748b;
  font-size: 1.125rem;
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

/* Info Card */
.info-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.info-header i {
  font-size: 1.5rem;
  color: #0062ae;
}

.info-header h3 {
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;
}

/* Upload Card */
.upload-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 2rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.form-group label i {
  color: #dc2626;
  font-size: 1.25rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.75rem;
}

.file-info i {
  color: #3b82f6;
}

:deep(.file-upload-custom .p-fileupload-choose) {
  background: #3b82f6;
  border-color: #3b82f6;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

:deep(.file-upload-custom .p-fileupload-choose:hover) {
  background: #2563eb;
  border-color: #2563eb;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

  .info-card,
  .upload-card {
    padding: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .button-group button {
    width: 100%;
  }
}
</style>