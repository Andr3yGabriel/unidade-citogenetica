<script lang="ts">
import { Button, Toast, useToast, TabView, TabPanel, Dialog, InputText, Dropdown } from 'primevue';
import { defineComponent, onMounted, ref } from 'vue';
import apiClient from '../axiosConfig';
import router from '../router/router';

interface User {
  id: number;
  completeName: string;
  email: string;
  document: string;
  userType: {
    id: number;
    name: string;
  };
}

interface ExamType {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  name: string;
}

interface Stats {
  totalUsers: number;
  totalExams: number;
  usersByType: { [key: string]: number };
  examsByStatus: { [key: string]: number };
}

export default defineComponent({
    name: "AdminPanel",
    components: {
        Button,
        Toast,
        TabView,
        TabPanel,
        Dialog,
        InputText,
        Dropdown
    },
    setup() {
        const toast = useToast();
        const token = localStorage.getItem("token") || "";
        const userId = localStorage.getItem("userId") || "";
        
        // User menu
        const userName = ref<string>("Carregando...");
        const userTypeLabel = ref<string>("Administrador");
        const showDropdown = ref(false);

        // Users management
        const users = ref<User[]>([]);
        const showUserDialog = ref(false);
        const editingUser = ref<User | null>(null);
        const userForm = ref({
            completeName: '',
            email: '',
            document: '',
            userTypeId: null as number | null,
            password: ''
        });
        const userTypes = ref<UserType[]>([]);
        const isNewUser = ref(true);

        // Exam types management
        const examTypes = ref<ExamType[]>([]);
        const showExamTypeDialog = ref(false);
        const editingExamType = ref<ExamType | null>(null);
        const examTypeForm = ref({
            name: ''
        });
        const isNewExamType = ref(true);

        // Statistics
        const stats = ref<Stats>({
            totalUsers: 0,
            totalExams: 0,
            usersByType: {},
            examsByStatus: {}
        });

        const fetchUserInfo = async () => {
            try {
                const response = await apiClient.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                userName.value = response.data.completeName || response.data.email || "Admin";
            } catch (error) {
                console.error("Erro ao buscar info do usuário:", error);
                userName.value = "Admin";
            }
        };

        const fetchUserTypes = async () => {
            try {
                const response = await apiClient.get('/admin/user-types', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                userTypes.value = response.data;
            } catch (error) {
                console.error("Erro ao buscar tipos de usuário:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                users.value = response.data;
            } catch (error: any) {
                console.error("Erro ao listar usuários:", error);
                toast.add({ severity: "error", summary: "Erro", detail: "Não foi possível carregar usuários." });
            }
        };

        const fetchExamTypes = async () => {
            try {
                const response = await apiClient.get('/exam-types', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                examTypes.value = response.data;
            } catch (error: any) {
                console.error("Erro ao listar tipos de exame:", error);
                toast.add({ severity: "error", summary: "Erro", detail: "Não foi possível carregar tipos de exame." });
            }
        };

        const fetchStats = async () => {
            try {
                // Buscar estatísticas (você pode criar endpoints específicos depois)
                stats.value.totalUsers = users.value.length;
                
                // Contar usuários por tipo
                const usersByType: { [key: string]: number } = {};
                users.value.forEach(user => {
                    const typeName = user.userType.name;
                    usersByType[typeName] = (usersByType[typeName] || 0) + 1;
                });
                stats.value.usersByType = usersByType;
            } catch (error) {
                console.error("Erro ao buscar estatísticas:", error);
            }
        };

        onMounted(async () => {
            await fetchUserInfo();
            await fetchUserTypes();
            await fetchUsers();
            await fetchExamTypes();
            await fetchStats();
        });

        const openNewUserDialog = () => {
            isNewUser.value = true;
            editingUser.value = null;
            userForm.value = {
                completeName: '',
                email: '',
                document: '',
                userTypeId: null,
                password: ''
            };
            showUserDialog.value = true;
        };

        const openEditUserDialog = (user: User) => {
            isNewUser.value = false;
            editingUser.value = user;
            userForm.value = {
                completeName: user.completeName,
                email: user.email,
                document: user.document,
                userTypeId: user.userType.id,
                password: ''
            };
            showUserDialog.value = true;
        };

        const saveUser = async () => {
            try {
                if (isNewUser.value) {
                    // Criar novo usuário via /admin/register/worker
                    await apiClient.post('/admin/register/worker', {
                        completeName: userForm.value.completeName,
                        email: userForm.value.email,
                        document: userForm.value.document,
                        password: userForm.value.password,
                        userTypeId: userForm.value.userTypeId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.add({ severity: "success", summary: "Sucesso", detail: "Usuário criado com sucesso!" });
                } else {
                    // Editar usuário existente
                    await apiClient.patch(`/admin/users/${editingUser.value?.id}`, {
                        completeName: userForm.value.completeName,
                        email: userForm.value.email,
                        document: userForm.value.document,
                        userTypeId: userForm.value.userTypeId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.add({ severity: "success", summary: "Sucesso", detail: "Usuário atualizado com sucesso!" });
                }
                showUserDialog.value = false;
                await fetchUsers();
                await fetchStats();
            } catch (error: any) {
                console.error("Erro ao salvar usuário:", error);
                const message = error.response?.data?.message || "Erro ao salvar usuário";
                toast.add({ severity: "error", summary: "Erro", detail: message });
            }
        };

        const openNewExamTypeDialog = () => {
            isNewExamType.value = true;
            editingExamType.value = null;
            examTypeForm.value = { name: '' };
            showExamTypeDialog.value = true;
        };

        const openEditExamTypeDialog = (examType: ExamType) => {
            isNewExamType.value = false;
            editingExamType.value = examType;
            examTypeForm.value = { name: examType.name };
            showExamTypeDialog.value = true;
        };

        const saveExamType = async () => {
            try {
                if (isNewExamType.value) {
                    await apiClient.post('/admin/exam-types', {
                        name: examTypeForm.value.name
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.add({ severity: "success", summary: "Sucesso", detail: "Tipo de exame criado com sucesso!" });
                } else {
                    await apiClient.patch(`/admin/exam-types/${editingExamType.value?.id}`, {
                        name: examTypeForm.value.name
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.add({ severity: "success", summary: "Sucesso", detail: "Tipo de exame atualizado com sucesso!" });
                }
                showExamTypeDialog.value = false;
                await fetchExamTypes();
            } catch (error: any) {
                console.error("Erro ao salvar tipo de exame:", error);
                const message = error.response?.data?.message || "Erro ao salvar tipo de exame";
                toast.add({ severity: "error", summary: "Erro", detail: message });
            }
        };

        const deleteExamType = async (examType: ExamType) => {
            if (!confirm(`Tem certeza que deseja deletar o tipo de exame "${examType.name}"?`)) {
                return;
            }

            try {
                await apiClient.delete(`/admin/exam-types/${examType.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.add({ severity: "success", summary: "Sucesso", detail: "Tipo de exame deletado com sucesso!" });
                await fetchExamTypes();
            } catch (error: any) {
                console.error("Erro ao deletar tipo de exame:", error);
                const message = error.response?.data?.message || "Erro ao deletar tipo de exame";
                toast.add({ severity: "error", summary: "Erro", detail: message });
            }
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
            userName,
            userTypeLabel,
            showDropdown,
            toggleDropdown,
            logout,
            goToHome,
            users,
            examTypes,
            stats,
            showUserDialog,
            showExamTypeDialog,
            userForm,
            examTypeForm,
            userTypes,
            isNewUser,
            isNewExamType,
            openNewUserDialog,
            openEditUserDialog,
            saveUser,
            openNewExamTypeDialog,
            openEditExamTypeDialog,
            saveExamType,
            deleteExamType
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
          <h1>Painel Administrativo</h1>
          <p class="subtitle">Gerencie usuários, tipos de exame e visualize estatísticas</p>
        </div>

        <!-- Tabs -->
        <TabView>
          <!-- Tab Dashboard -->
          <TabPanel header="Dashboard" value="0">
            <div class="stats-grid">
              <div class="stat-card">
                <i class="pi pi-users stat-icon"></i>
                <div class="stat-content">
                  <h3>{{ stats.totalUsers }}</h3>
                  <p>Total de Usuários</p>
                </div>
              </div>

              <div class="stat-card" v-for="(count, type) in stats.usersByType" :key="type">
                <i class="pi pi-user stat-icon"></i>
                <div class="stat-content">
                  <h3>{{ count }}</h3>
                  <p>{{ type }}</p>
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Tab Usuários -->
          <TabPanel header="Usuários" value="1">
            <div class="tab-header">
              <Button 
                label="Novo Usuário" 
                icon="pi pi-plus"
                @click="openNewUserDialog"
              />
            </div>

            <div class="users-list">
              <div 
                v-for="user in users" 
                :key="user.id"
                class="user-card"
                @click="openEditUserDialog(user)"
              >
                <div class="user-info-card">
                  <h4>{{ user.completeName }}</h4>
                  <p class="user-email">{{ user.email }}</p>
                  <p class="user-document">CPF: {{ user.document }}</p>
                </div>
                <div class="user-type-badge">
                  {{ user.userType.name }}
                </div>
              </div>
            </div>
          </TabPanel>

          <!-- Tab Tipos de Exame -->
          <TabPanel header="Tipos de Exame" value="2">
            <div class="tab-header">
              <Button 
                label="Novo Tipo de Exame" 
                icon="pi pi-plus"
                @click="openNewExamTypeDialog"
              />
            </div>

            <div class="exam-types-list">
              <div 
                v-for="examType in examTypes" 
                :key="examType.id"
                class="exam-type-card"
              >
                <div class="exam-type-name">
                  <i class="pi pi-file-medical"></i>
                  <span>{{ examType.name }}</span>
                </div>
                <div class="exam-type-actions">
                  <Button 
                    icon="pi pi-pencil" 
                    class="p-button-text p-button-sm"
                    @click="openEditExamTypeDialog(examType)"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    class="p-button-text p-button-danger p-button-sm"
                    @click="deleteExamType(examType)"
                  />
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <!-- Dialog Usuário -->
    <Dialog 
      v-model:visible="showUserDialog" 
      :header="isNewUser ? 'Novo Usuário' : 'Editar Usuário'"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div class="dialog-form">
        <div class="p-field">
          <label for="name">Nome Completo</label>
          <InputText id="name" v-model="userForm.completeName" />
        </div>

        <div class="p-field">
          <label for="email">E-mail</label>
          <InputText id="email" v-model="userForm.email" type="email" />
        </div>

        <div class="p-field">
          <label for="document">CPF</label>
          <InputText id="document" v-model="userForm.document" />
        </div>

        <div class="p-field">
          <label for="userType">Tipo de Usuário</label>
          <Dropdown 
            id="userType" 
            v-model="userForm.userTypeId" 
            :options="userTypes" 
            optionLabel="name" 
            optionValue="id"
            placeholder="Selecione o tipo"
          />
        </div>

        <div class="p-field" v-if="isNewUser">
          <label for="password">Senha</label>
          <InputText id="password" v-model="userForm.password" type="password" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="showUserDialog = false" class="p-button-text" />
        <Button label="Salvar" icon="pi pi-check" @click="saveUser" />
      </template>
    </Dialog>

    <!-- Dialog Tipo de Exame -->
    <Dialog 
      v-model:visible="showExamTypeDialog" 
      :header="isNewExamType ? 'Novo Tipo de Exame' : 'Editar Tipo de Exame'"
      :modal="true"
      :style="{ width: '400px' }"
    >
      <div class="dialog-form">
        <div class="p-field">
          <label for="examTypeName">Nome do Tipo de Exame</label>
          <InputText id="examTypeName" v-model="examTypeForm.name" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="showExamTypeDialog = false" class="p-button-text" />
        <Button label="Salvar" icon="pi pi-check" @click="saveExamType" />
      </template>
    </Dialog>
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
  max-width: 1200px;
  margin: 0 auto;
}

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

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  color: #0062ae;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.stat-content p {
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
}

/* Tab Header */
.tab-header {
  margin-bottom: 2rem;
}

/* Users List */
.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #0062ae;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-info-card h4 {
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
}

.user-email,
.user-document {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.user-type-badge {
  margin-top: 1rem;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Exam Types List */
.exam-types-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exam-type-card {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.exam-type-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: #1e293b;
}

.exam-type-name i {
  color: #0062ae;
  font-size: 1.5rem;
}

.exam-type-actions {
  display: flex;
  gap: 0.5rem;
}

/* Dialog Form */
.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.p-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.p-field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

/* Responsivo */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .users-list {
    grid-template-columns: 1fr;
  }
}
</style>