<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { Button, InputText, Select } from 'primevue';

interface ExamType {
    id: number;
    name: string;
}

export default defineComponent({
    name: "RequestExam",
    components: {
        AppHeader,
        AppFooter,
        InputText,
        Select,
        Button,
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
                    detail: 'Preencha todos os campos.'
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
    <div class="page-container">
        <AppHeader />
        <div class="container">
            <h2>Solicitar Novo Exame</h2>
            <form @submit.prevent="handleSubmit">
                <div class="p-field">
                    <label for="cpf">CPF do Paciente:</label>
                    <InputText id="cpf" v-model="patientDocument" />
                </div>
                <div class="p-field">
                    <label for="exam-type">Tipo de Exame:</label>
                    <Select id="exam-type" v-model="selectedExamType" :options="examTypes" optionLabel="name" optionValue="id" placeholder="Selecione o tipo de exame" />
                </div>
                <div class="buttons">
                    <Button type="submit" label="Enviar" class="p-button-success" />
                    <Button type="button" label="Cancelar" class="p-button-danger" @click="handleCancel" />
                </div>
            </form>
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

.container {
    margin: auto;
    padding: 20px;
    width: 60%;
    flex-grow: 1;
}

h2 {
    color: $dark-gray;
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: $background-color;
    padding: 20px;
    border-radius: 5px;
    border: 2px solid $medium-gray;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.1);
}

.p-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
}
</style>
