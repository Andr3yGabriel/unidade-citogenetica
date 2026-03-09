<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import BackButton from '../components/BackButton.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { Button, FileUpload } from 'primevue';

export default defineComponent({
    name: "AddExamFile",
    components: {
        AppHeader,
        AppFooter,
        FileUpload,
        Button,
        BackButton,
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const file = ref<File | null>(null);

        const handleFileUpload = (event: any) => {
            file.value = event.files[0];
        };

        const handleSubmit = async () => {
            if (!file.value) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Por favor, selecione um arquivo."
                });
                return;
            }

            const examId = localStorage.getItem("selectedExamId");
            if (!examId) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Nenhum exame selecionado."
                });
                router.push("/AllExamsList");
                return;
            }

            const formData = new FormData();
            formData.append('laudoFile', file.value);

            try {
                const response = await apiClient.post(`/reports/upload/${examId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.status === 200) {
                    toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Laudo enviado com sucesso!"
                    });
                    router.push("/AllExamsList");
                }
            } catch (error) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao enviar laudo!"
                });
            }
        };

        const handleCancel = () => {
            router.push("/AllExamsList");
        };

        return {
            handleFileUpload,
            handleSubmit,
            handleCancel,
        };
    }
});
</script>

<template>
    <div class="page-container">
        <BackButton to="/AllExamsList" style="position: absolute; top: 130px; left: 15px;" />
        <AppHeader />
        <div class="container" style="padding-top: 60px;">
            <h2>Inserir Laudo do Exame</h2>
            <form @submit.prevent="handleSubmit">
                <div class="p-field">
                    <label for="arquivo">Arquivo:</label>
                    <FileUpload id="arquivo" mode="basic" name="laudoFile" accept="application/pdf" :maxFileSize="10000000" @select="handleFileUpload" required />
                </div>

                <div class="buttons">
                    <Button type="submit" label="ENVIAR" class="p-button-success" />
                    <Button type="button" label="CANCELAR" class="p-button-danger" @click="handleCancel" />
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