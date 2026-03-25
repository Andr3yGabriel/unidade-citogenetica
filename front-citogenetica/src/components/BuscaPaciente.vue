<!-- front-citogenetica/src/components/BuscaPaciente.vue -->

<template>
  <div>
    <!-- Navbar igual às outras páginas -->
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

    <!-- Conteúdo da busca -->
    <div class="busca-paciente-container">
      <div class="card">
        <div class="card-header">
          <h3>Buscar Paciente</h3>
        </div>
        
        <div class="card-body">
          <!-- Campo de busca -->
          <div class="form-group">
            <label for="termoBusca">CPF ou Número SUS</label>
            <div class="input-group">
              <InputText
                id="termoBusca"
                v-model="termoBusca"
                placeholder="Digite o CPF ou número SUS"
                class="input-busca"
                @keyup.enter="buscarPaciente"
              />
              <Button
                label="Buscar"
                icon="pi pi-search"
                @click="buscarPaciente"
                :loading="carregando"
                :disabled="!termoBusca"
                class="btn-buscar"
              />
            </div>
            <small class="texto-ajuda">
              Digite o CPF (11 dígitos) ou o número do cartão SUS (15 dígitos)
            </small>
          </div>

          <!-- Loading -->
          <div v-if="carregando" class="loading-container">
            <ProgressSpinner />
            <p>Buscando paciente...</p>
          </div>

          <!-- Mensagem de erro -->
          <Message
            v-if="erro"
            severity="error"
            :closable="true"
            @close="limparErro"
          >
            {{ erro }}
          </Message>

          <!-- Resultado da busca -->
          <div v-if="pacienteEncontrado && !carregando" class="resultado-busca">
            <Message severity="success">
              Paciente encontrado com sucesso!
            </Message>
            
            <div class="dados-paciente">
              <h4>Dados do Paciente</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Nome:</span>
                  <span class="valor">{{ pacienteEncontrado.completeName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">CPF:</span>
                  <span class="valor">{{ formatarCpf(pacienteEncontrado.document) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Número SUS:</span>
                  <span class="valor">{{ pacienteEncontrado.susNumber || 'Não informado' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">E-mail:</span>
                  <span class="valor">{{ pacienteEncontrado.email }}</span>
                </div>
              </div>

              <div class="acoes-paciente">
                <Button
                  label="Ver Exames"
                  icon="pi pi-file-medical"
                  class="p-button-primary"
                  @click="verExames"
                />
                <Button
                  label="Nova Busca"
                  icon="pi pi-refresh"
                  class="p-button-secondary"
                  @click="limparBusca"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { buscarPacientePorCpfOuSus } from '@/services/pacienteService';
import { useRouter } from 'vue-router';

const router = useRouter();

// Estados
const termoBusca = ref('');
const pacienteEncontrado = ref<any>(null);
const carregando = ref(false);
const erro = ref('');

// Métodos
const buscarPaciente = async () => {
  if (!termoBusca.value || termoBusca.value.trim().length < 11) {
    erro.value = 'Digite um CPF ou número SUS válido (mínimo 11 caracteres)';
    return;
  }

  carregando.value = true;
  erro.value = '';
  pacienteEncontrado.value = null;

  try {
    const response = await buscarPacientePorCpfOuSus(termoBusca.value.trim());
    
    if (response.data && response.data.paciente) {
      pacienteEncontrado.value = response.data.paciente;
    } else {
      erro.value = 'Paciente não encontrado';
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      erro.value = 'Nenhum paciente encontrado com os dados informados';
    } else if (error.response?.status === 401) {
      erro.value = 'Sessão expirada. Faça login novamente.';
      setTimeout(() => router.push('/Login'), 2000);
    } else if (error.response?.status === 403) {
      erro.value = 'Você não tem permissão para realizar buscas';
    } else if (error.response?.data?.mensagem) {
      erro.value = error.response.data.mensagem;
    } else {
      erro.value = 'Erro ao buscar paciente. Tente novamente.';
    }
    console.error('Erro na busca:', error);
  } finally {
    carregando.value = false;
  }
};

const limparBusca = () => {
  termoBusca.value = '';
  pacienteEncontrado.value = null;
  erro.value = '';
};

const limparErro = () => {
  erro.value = '';
};

const verExames = () => {
  if (pacienteEncontrado.value) {
    // Salva o ID do paciente e vai para a lista de exames do paciente
    localStorage.setItem('selectedPatientId', pacienteEncontrado.value.id.toString());
    router.push('/PatientList');
  }
};

const goToHome = () => {
  router.push('/');
};

// Formatadores
const formatarCpf = (cpf: string): string => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};
</script>

<style scoped>
/* Navbar */
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
  cursor: pointer;
}

.user-profile {
  height: 50px;
  width: 50px;
  color: white;
  font-weight: 200;
}

/* Container principal */
.busca-paciente-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  background: #3b82f6;
  color: white;
  padding: 1.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.card-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-busca {
  flex: 1;
}

.texto-ajuda {
  display: block;
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.loading-container p {
  margin-top: 1rem;
  color: #6b7280;
}

.resultado-busca {
  margin-top: 2rem;
}

.dados-paciente {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.dados-paciente h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.info-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.info-item .label {
  font-weight: 600;
  color: #374151;
  min-width: 150px;
}

.info-item .valor {
  color: #1f2937;
}

.acoes-paciente {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .input-group {
    flex-direction: column;
  }

  .acoes-paciente {
    flex-direction: column;
  }

  .info-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item .label {
    min-width: auto;
  }
}
</style>