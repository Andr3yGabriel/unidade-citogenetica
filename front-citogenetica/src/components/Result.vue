<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import { Button } from 'primevue';

export default defineComponent({
    name: "ExamResult",
    components: {
        Button
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const examResult = ref<string | null>(null);
        const errorMessage = ref<string | null>(null);

        // Fetch the exam result
        const fetchExamResult = async () => {
            const examId = localStorage.getItem("selectedExamId");

            if (!examId) {
                errorMessage.value = "Nenhum exame selecionado.";
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: errorMessage.value
                });
                router.push("/");
                return;
            }

            try {
                const response = await apiClient.get(`/result/${examId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.data) {
                    // Converte Base64 para Blob e cria URL para o iframe
                    const byteCharacters = atob(response.data.split(',')[1]); // Remove o "data:application/pdf;base64,"
                    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: "application/pdf" });

                    examResult.value = URL.createObjectURL(blob);
                } else {
                    errorMessage.value = "Nenhum resultado encontrado para este exame.";
                    toast.add({
                        severity: "warn",
                        summary: "Aviso",
                        detail: errorMessage.value
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar resultado do exame: ", error);
                errorMessage.value = "Erro ao buscar resultado do exame.";
                toast.add({
                    severity: "error",
                    summary: "Erro",
                    detail: errorMessage.value
                });
            }
        };

        // Handle print action
        const handlePrint = () => {
            if (examResult.value) {
                const pdfWindow = window.open("");
                pdfWindow?.document.write(`
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="data:application/pdf;base64,${examResult.value}"
                    ></iframe>
                `);
                pdfWindow?.document.close();
                pdfWindow?.print();
            }
        };

        // Handle back to home
        const goToHome = () => {
            router.push("/");
        };

        const back = () => {
            const userType = localStorage.getItem("userType");
            if (userType === "medico") {
                router.push("DoctorList");
            } else if (userType === "tecnico" || userType === "admin") {
                router.push("AllExamsList");
            } else if (userType === "paciente") {
                router.push("PatientList");
            }
        }

        // Fetch the exam result when the component mounts
        onMounted(() => {
            fetchExamResult();
        });

        return {
            examResult,
            handlePrint,
            goToHome,
            back
        };
    }
});
</script>

<template>
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
    <div id="pagina-resultado">
        <main id="container-resultado">
            <div id="container-bt-imprimir">
                <Button 
                    id="bt-imprimir" 
                    icon="pi pi-print" 
                    label="Imprimir" 
                    @click="handlePrint" 
                />
            </div>
            <h2>Resultado do exame</h2>
            <section id="pdf">
                <iframe 
                    v-if="examResult" 
                    width="100%" 
                    height="100%" 
                    :src="examResult"
                ></iframe>
                <p v-else>Nenhum resultado disponível.</p>
            </section>
            <Button 
                class="bt-home" 
                label="Voltar" 
                icon="pi pi-arrow-left" 
                @click="back" 
            />
        </main>
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

#pagina-resultado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#container-resultado {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#container-bt-imprimir {
  display: flex;
  align-items: center;
  justify-content: right;
  margin-top: 20px;
  width: 30%;
}

#bt-imprimir {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dedede;
  border-radius: 10px;
  box-shadow: 1px 1px gray;
  height: 37px;
  width: 100px;
}

#pdf {
  height: 70vh;
  margin: 30px;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #8e8e8e;
}

#pdf p {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.5);
}

.bt-home {
  text-decoration: none;
}

@media (max-width: 1024px) {
  #container-resultado {
    width: 100%;
    padding: 10px;
  }

  #container-bt-imprimir {
    width: 100%;
    justify-content: center;
    margin: 10px 0;
  }

  #bt-imprimir {
    width: 100px;
    height: 40px;
  }

  #pdf {
    width: 90%;
    height: 60vh;
    margin: 20px 0;
  }

  #pdf p {
    font-size: 1rem;
  }
}
</style>