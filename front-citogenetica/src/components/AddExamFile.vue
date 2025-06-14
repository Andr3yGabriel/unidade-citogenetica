<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import { Button, DatePicker, FileUpload, InputText, Select } from 'primevue';
import { format } from 'date-fns';

export default defineComponent({
    name: "AddExamFile",
    components: {
        InputText,
        Select,
        DatePicker,
        FileUpload,
        Button
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const date = ref<Date>(new Date()); // Keep as Date object
        const examType = ref<string>('');
        const file = ref<File | null>(null);
        const errorMessage = ref<string | null>(null);

        const examTypes = ref([
            { label: 'Selecione', value: '' },
            { label: 'Exame de Sangue', value: 'sangue' },
            { label: 'Exame de Urina', value: 'urina' },
            { label: 'Teste do Pézinho', value: 'imagem' },
        ]);

        // Format the date for display (dd/mm/yyyy)
        const formattedDate = computed(() => {
            return format(date.value, 'dd/MM/yyyy');
        });

        const handleFileUpload = (event: any) => {
            file.value = event.files[0];
        };

        const convertFileToBase64 = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
            });
        };

        const handleSubmit = async () => {
            if (!file.value) {
                errorMessage.value = "Por favor, selecione um arquivo.";
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: errorMessage.value
                });
                return;
            }

            try {
                const base64File = await convertFileToBase64(file.value);

                // Send the date as a Date object (or format it for the API if needed)
                const response = await apiClient.put('/examFile', {
                    id: new Number(localStorage.getItem("selectedExamId")),
                    exam_date: date.value.toISOString().split('T')[0], // Format for API if needed
                    type: examType.value,
                    file: base64File
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.status === 200) {
                    toast.add({
                        severity: "success",
                        summary: "Sucesso",
                        detail: "Exame enviado com sucesso!"
                    });
                    router.push("AllExamsList");
                }
            } catch (error) {
                console.error("Erro ao enviar exame: ", error);
                errorMessage.value = "Erro ao enviar exame!";
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: errorMessage.value
                });
            }
        };

        const handleCancel = () => {
            router.push("AllExamsList");
        };

        const goToHome = () => {
            router.push("/")
        };

        return {
            date,
            examType,
            examTypes,
            formattedDate, // Add formattedDate to the template
            handleFileUpload,
            handleSubmit,
            handleCancel,
            goToHome
        };
    }
});
</script>

<template>
    <Toast position="top-left" />
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
    <div class="container">
        <h2>Inserção dos Exames</h2>
        <form @submit.prevent="handleSubmit">
            <div class="p-field">
                <label for="data">Data:</label>
                <DatePicker id="data" v-model="date" dateFormat="dd/mm/yy" required />
                <p>Data selecionada: {{ formattedDate }}</p>
            </div>

            <div class="p-field">
                <label for="tipo-exame">Tipo do Exame:</label>
                <Select id="tipo-exame" v-model="examType" :options="examTypes" optionLabel="label" optionValue="value" placeholder="Selecione" required />
            </div>

            <div class="p-field">
                <label for="arquivo">Arquivo:</label>
                <FileUpload id="arquivo" mode="basic" name="file" accept="application/pdf" :maxFileSize="1000000" @select="handleFileUpload" required />
            </div>

            <div class="buttons">
                <Button type="submit" label="ENVIAR" class="p-button-success" />
                <Button type="button" label="CANCELAR" class="p-button-danger" @click="handleCancel" />
            </div>
        </form>
    </div>
    <footer>
        <p>
            Desenvolvido por
            <a href="https://github.com/Andr3yGabriel">Andrey Gonçalves</a> |
            <a href="https://github.com/javu4k">Júlia Peghini</a> |
            <a href="https://github.com/s4abr1na">Sabrina Souza </a> |
            <a href="https://github.com/davih1660">Davi Cruz</a> - 2024
        </p>
    </footer>
</template>

<style lang="scss">
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
}

.user-profile {
  height: 50px;
  width: 50px;
  color: white;
  font-weight: 200;
}

.container {
    margin: auto;
    padding: 20px;
    width: 60%;
}

h2 {
    color: #555;
}

form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: white;
    padding: 20px;
    border-radius: 5px;
    border: 2px solid #AEAEAE;
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