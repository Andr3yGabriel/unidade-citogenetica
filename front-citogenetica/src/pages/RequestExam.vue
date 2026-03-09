<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Toast from 'primevue/toast';

interface ExamType {
    id: number;
    name: string;
}

export default defineComponent({
    name: "RequestExam",
    components: {
        InputText,
        Select,
        Button,
        Toast,
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const patientDocument = ref('');
        const selectedExamType = ref<number | null>(null);
        const examTypes = ref<ExamType[]>([]);

        const fetchExamTypes = async () => {
            try {
                const response = await apiClient.get<ExamType[]>('/exam-types', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                examTypes.value = response.data;
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os tipos de exame.'
                });
            }
        };

        onMounted(fetchExamTypes);

        const handleSubmit = async () => {
            if (!patientDocument.value || !selectedExamType.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Por favor, preencha todos os campos.'
                });
                return;
            }

            try {
                const patientResponse = await apiClient.get(`/users/document/${patientDocument.value}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const patientId = patientResponse.data.id;
                const requestingDoctorId = Number(localStorage.getItem('userId'));

                await apiClient.post('/exams', {
                    patientId,
                    requestingDoctorId,
                    examTypeId: selectedExamType.value
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Solicitação de exame criada com sucesso!'
                });

                router.push('/DoctorList');
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível criar a solicitação de exame.'
                });
            }
        };

        const handleCancel = () => {
            router.push('/DoctorList');
        };

        return {
            patientDocument,
            selectedExamType,
            examTypes,
            handleSubmit,
            handleCancel
        };
    }
});
</script>

<template>
    <Toast position="top-right" />
    <div class="page-container">
        <nav class="navbar">
            <a @click="handleCancel">
                <img
                    src="../assets/logo-unidade.jpg"
                    alt="Logo da unidade genética"
                    class="logo"
                />
            </a>
            <span>
                <ion-icon name="person-circle-outline" class="user-profile"></ion-icon>
            </span>
        </nav>

        <div class="container">
            <h2>Solicitar Novo Exame</h2>
            <form @submit.prevent="handleSubmit">
                <div class="p-field">
                    <label for="cpf">CPF do Paciente:</label>
                    <InputText 
                        id="cpf" 
                        v-model="patientDocument"
                        placeholder="Digite o CPF do paciente"
                    />
                </div>
                
                <div class="p-field">
                    <label for="exam-type">Tipo de Exame:</label>
                    <Select 
                        id="exam-type" 
                        v-model="selectedExamType" 
                        :options="examTypes" 
                        optionLabel="name" 
                        optionValue="id" 
                        placeholder="Selecione o tipo de exame"
                    />
                </div>

                <div class="button-group">
                    <Button 
                        type="submit" 
                        label="Solicitar Exame" 
                        icon="pi pi-check"
                        class="p-button-success"
                    />
                    <Button 
                        type="button" 
                        label="Cancelar" 
                        icon="pi pi-times"
                        class="p-button-secondary"
                        @click="handleCancel"
                    />
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    min-height: 100vh;
    background-color: #f5f5f5;
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
    cursor: pointer;
}

.user-profile {
    height: 50px;
    width: 50px;
    color: white;
    font-weight: 200;
}

.container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
}

.p-field {
    margin-bottom: 1.5rem;
}

.p-field label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #374151;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
}

@media (max-width: 640px) {
    .button-group {
        flex-direction: column;
    }
}
</style>