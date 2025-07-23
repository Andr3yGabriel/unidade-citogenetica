<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import BackButton from '../components/BackButton.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import WorkerCard from '../components/WorkerCard.vue';
import { Button } from 'primevue';

interface ApiWorkerResponse {
  id: number;
  completeName: string;
  isActive: boolean;
  userType: {
    name: string;
  };
}

interface DisplayWorker {
  id: number;
  name: string;
  role: string;
  isActive: boolean;
}

export default defineComponent({
  name: "AdminList",
  components: {
    AppHeader,
    AppFooter,
    WorkerCard,
    BackButton,
    Button
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const token = localStorage.getItem("token") || "";
    const workers = ref<DisplayWorker[]>([]);
    const selectedWorker = ref<DisplayWorker | null>(null);
    const showModal = ref(false);
    const isActivating = ref(false);

    const fetchWorkers = async () => {
      if (!token) {
        toast.add({ severity: "error", summary: "Erro de Autenticação", detail: "Sessão expirada. Faça o login novamente." });
        router.push("/login");
        return;
      }

      try {
        const response = await apiClient.get<ApiWorkerResponse[]>('/admin/workers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        workers.value = response.data.map((worker: ApiWorkerResponse) => ({
          id: worker.id,
          name: worker.completeName,
          role: worker.userType.name,
          isActive: worker.isActive,
        }));

      } catch (error: any) {
        const detail = error.response?.data?.message || "Não foi possível buscar os funcionários.";
        toast.add({ severity: "error", summary: "Erro de Rede", detail });
      }
    };

    onMounted(fetchWorkers);

    const openModal = (worker: DisplayWorker, activating: boolean) => {
      selectedWorker.value = worker;
      isActivating.value = activating;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      selectedWorker.value = null;
    };

    const confirmAction = async () => {
      if (!selectedWorker.value) return;

      const workerId = selectedWorker.value.id;
      const action = isActivating.value ? 'activate' : 'deactivate';
      const url = `/admin/workers/${action}/${workerId}`;

      try {
        await apiClient.patch(url, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const message = `Funcionário ${isActivating.value ? 'ativado' : 'inativado'} com sucesso.`;
        toast.add({ severity: "success", summary: "Sucesso", detail: message });

        fetchWorkers();
        closeModal();

      } catch (error: any) {
        const detail = error.response?.data?.message || `Não foi possível ${isActivating.value ? 'ativar' : 'inativar'} o funcionário.`;
        toast.add({ severity: "error", summary: "Erro de Rede", detail });
      }
    };

    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("userId");
    };

    return {
      workers,
      showModal,
      isActivating,
      selectedWorker,
      openModal,
      closeModal,
      confirmAction,
      logout,
      goToAdd: () => {
        router.push("AddWorker");
      }
    };
  }
});
</script>

<template>
  <div class="page-container">
    <BackButton to="/login" :beforeNavigate="logout" style="position: absolute; top: 130px; left: 15px;" />
    <AppHeader />
    <main id="box-situacao" style="padding-top: 60px;">
      <h1 class="titulo">Gerenciar Funcionários</h1>
      <section id="box-interacao">
        <Button
          label="Cadastrar Funcionário"
          icon="pi pi-plus"
          class="bt-add-exame"
          @click="goToAdd"
        />
      </section>
      <section id="tabela-pacientes">
        <div v-if="workers.length < 1" class="sem-exames">
          <h3>Nenhum funcionário encontrado.</h3>
        </div>
        <ul>
          <WorkerCard
            v-for="worker in workers"
            :key="worker.id"
            :worker="worker"
            @activate="openModal(worker, true)"
            @deactivate="openModal(worker, false)"
          />
        </ul>
      </section>
    </main>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>{{ isActivating ? 'Tem certeza que gostaria de ativar esse funcionário?' : 'Tem certeza que gostaria de inativar esse funcionário?' }}</p>
        <div class="modal-buttons">
          <button @click="confirmAction" :class="isActivating ? 'activate' : 'deactivate'">{{ isActivating ? 'Ativar' : 'Inativar' }}</button>
          <button @click="closeModal" class="cancel">Cancelar</button>
        </div>
      </div>
    </div>

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

#box-interacao {
  display: flex;
  justify-content: left;
  align-items: flex-start;
  flex-direction: column;
  width: fit-content;
  background-color: $background-color;
  width: 61%;
  margin: 15px 0px 30px 0px;
}

#bt-add-worker {
  width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 2px lightgray;
  margin: 10px 0px;
}

#add-box {
  color: $light-gray;
  background-color: #aaaaaa;
  margin-right: 10px;
}

#bt-add-exame p {
  color: $text-color;
  opacity: 0.81;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;

  p {
    margin-bottom: 20px;
  }

  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      color: white;
    }

    .activate {
      background-color: #00008B; 
    }

    .deactivate {
      background-color: #36454F;
    }

    .cancel {
      background-color: #FF0000;
    }
  }
}
</style>
