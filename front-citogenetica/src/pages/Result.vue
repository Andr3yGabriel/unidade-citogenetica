<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import BackButton from '../components/BackButton.vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { Button } from 'primevue';

export default defineComponent({
    name: "ExamResult",
    components: {
        AppHeader,
        AppFooter,
        Button,
        BackButton,
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const examResult = ref<string | null>(null);

        const fetchExamResult = async () => {
            const examId = localStorage.getItem("selectedExamId");

            if (!examId) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Nenhum exame selecionado."
                });
                router.push("/");
                return;
            }

            try {
                const response = await apiClient.get(`/reports/download/${examId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    responseType: 'blob'
                });

                if (response.data) {
                    const blob = new Blob([response.data], { type: "application/pdf" });
                    examResult.value = URL.createObjectURL(blob);
                } else {
                    toast.add({
                        severity: "warn",
                        summary: "Aviso",
                        detail: "Nenhum resultado encontrado para este exame."
                    });
                }
            } catch (error) {
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao buscar resultado do exame."
                });
            }
        };

        const pdfIframe = ref<HTMLIFrameElement | null>(null);

        const handlePrint = () => {
            if (pdfIframe.value?.contentWindow) {
                pdfIframe.value.contentWindow.print();
            } else {
                 toast.add({
                    severity: "error",
                    summary: "Erro de Impressão",
                    detail: "Não foi possível acessar o conteúdo para impressão."
                });
            }
        };

        const backRoute = () => {
            const userType = localStorage.getItem("userType");
            let path = "/";
            switch (userType) {
                case "medico":
                    path = "/DoctorList";
                    break;
                case "tecnico":
                case "admin":
                    path = "/AllExamsList";
                    break;
                case "paciente":
                    path = "/PatientList";
                    break;
            }
            router.push(path);
        };

        onMounted(fetchExamResult);

        return {
            examResult,
            handlePrint,
            backRoute,
            pdfIframe
        };
    }
});
</script>

<template>
    <div class="page-container">
        <AppHeader />
        <main id="container-resultado">
            <div id="container-bt-imprimir">
                <Button 
                    id="bt-imprimir" 
                    icon="pi pi-print" 
                    label="Imprimir" 
                    @click="handlePrint" 
                    :disabled="!examResult"
                />
            </div>
            <h2>Resultado do exame</h2>
            <section id="pdf">
                <iframe 
                    v-if="examResult" 
                    ref="pdfIframe"
                    width="100%" 
                    height="100%" 
                    :src="examResult"
                ></iframe>
                <p v-else>Nenhum resultado disponível.</p>
            </section>
            <Button
                label="Voltar" 
                icon="pi pi-arrow-left" 
                @click="backRoute" 
            />
        </main>
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

#container-resultado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
  padding-top: 10px;
  gap: 10px;
}

#container-bt-imprimir {
  display: flex;
  justify-content: flex-end;
  width: 50%;
  margin-bottom: 20px;
}

#bt-imprimir {
  background-color: $primary-color;
  border-radius: 7px;
  border: none;
  box-shadow: 1px 1px gray;
  height: 37px;
  width: 120px;
}

h2 {
    color: $dark-gray;
}

#pdf {
  height: 60vh;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8e8e8e;
  border: 1px solid $medium-gray;

  p {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.5);
  }
}



@media (max-width: 1024px) {
  #container-bt-imprimir {
    width: 90%;
    justify-content: center;
  }

  #pdf {
    width: 90%;
    height: 60vh;
  }
}
</style>