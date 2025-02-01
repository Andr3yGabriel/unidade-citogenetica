<script lang="ts">
import { Button, Toast, useToast } from 'primevue';
import { defineComponent, onMounted, ref } from 'vue';
import apiClient from '../axiosConfig';
import type { Exam } from '../interfaces/Exam';
import router from '../router/router';

export default defineComponent({
    name: "DoctorList",
    components: {
        Button,
        Toast
    },
    setup() {
        const toast = useToast();
        const token = localStorage.getItem("token") || "";
        const exams = ref<any[]>([]);
        const errorMessage = ref<string | null>(null);
        const userType = localStorage.getItem("userType");

        const formatDateToBrazilianPattern = (date: Date | string): string => {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.toLocaleDateString('pt-BR');
        }

        const fetchExams = async () => {
            if (token === "") {
                errorMessage.value = "Sessão expirada!";
                toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: errorMessage
                });
                router.push("Login");
                return;
            }
            if (userType === "3") {
              try {
                  const response = await apiClient.get('/exams', {
                      headers: {
                          Authorization: `Bearer ${token}`
                      }
                  });

                  exams.value = await Promise.all(response.data.map(async (exam: Exam) => ({
                      id: exam.id,
                      patient_document: exam.patient_document,
                      exam_date: formatDateToBrazilianPattern(exam.exam_date),
                      file: exam.file,
                      status: exam.file ? "PRONTO" : "NO LABORATÓRIO",
                      patient_name: await findUserName(exam.patient_document)
                  })));

                  console.log(exams);
              } catch (error) {
                  console.error("Erro ao listar exames: ", error);
                  errorMessage.value = "Erro ao listar exames!";
                  toast.add({
                      severity: "error",
                      summary: "Error",
                      detail: errorMessage
                  });
              }
            } else {
              try {
                  const response = await apiClient.get('/exam/doctor', {
                      headers: {
                          Authorization: `Bearer ${token}`
                      }
                  });

                  exams.value = await Promise.all(response.data.map(async (exam: Exam) => ({
                      id: exam.id,
                      patient_document: exam.patient_document,
                      exam_date: formatDateToBrazilianPattern(exam.exam_date),
                      file: exam.file,
                      status: exam.file ? "PRONTO" : "NO LABORATÓRIO",
                      patient_name: await findUserName(exam.patient_document)
                  })));

                  console.log(exams);
              } catch (error) {
                  console.error("Erro ao listar exames: ", error);
                  errorMessage.value = "Erro ao listar exames!";
                  toast.add({
                      severity: "error",
                      summary: "Error",
                      detail: errorMessage
                  });
              }
            }
        };

        const findUserName = async (patient_document: string) => {
            if (token === "") {
                errorMessage.value = "Sessão expirada!";
                toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: errorMessage
                });
                router.push("Login");
                return;
            }

            try {
                const response = await apiClient.get(`/pacient/${patient_document}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                return response.data
            } catch (error) {
                console.error("Erro ao buscar usuário: ", error);
                errorMessage.value = "Erro ao buscar usuário!";
                toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: errorMessage
                });
            }
        }

        onMounted(() => {
            fetchExams();
        });

        const handleExamClick = (examId: string, status: string) => {
            localStorage.setItem("selectedExamId", examId);
            if (userType === "3" && status === "NO LABORATÓRIO") {
                router.push("AddExamFile");
            } else {
                router.push("Result");
            }
        };

        const goToHome = () => {
            router.push("/");
        }

        return {
            exams,
            errorMessage,
            handleExamClick,
            goToHome,
        }
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
      <span
        ><ion-icon name="person-circle-outline" class="user-profile"></ion-icon
      ></span>
    </nav>
    <main id="box-situacao">
      <h1 class="titulo">Situação de Exames</h1>

      <section id="box-interacao">
        <span id="bt-add-exame">
          <ion-icon name="add-outline" id="add-box"></ion-icon>
          <p>Novo Exame</p>
        </span>
      </section>

      <section id="tabela-pacientes">
        <div v-if="exams.length < 1" class="sem-exames">
            <h3>Não há exames a serem exibidos</h3>
        </div>
          <ul>
            <li 
              v-for="exam in exams" 
              :key="exam.id" 
              class="card-lab" 
              :class="{ 'card-pronto': exam.status === 'PRONTO' }"
              @click="handleExamClick(exam.id.toString(), exam.status)"
            >
              <span class="info-paciente">
                <p>{{ exam.patient_name }}</p>
                <p>{{ exam.exam_date }}</p>
              </span>
              <span class="status">
                <p>{{ exam.status }}</p>
              </span>
            </li>
          </ul>
      </section>
    </main>
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

#box-situacao {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 10px 0px;
}

#box-situacao .titulo {
  color: #6e6e6e;
  font-weight: 300;
  font-size: 2.5rem;
}

#box-interacao {
  display: flex;
  justify-content: left;
  align-items: flex-start;
  flex-direction: column;
  width: fit-content;
  background-color: #fff;
  width: 61%;
  margin: 15px 0px 30px 0px;
}

#bt-add-exame {
  background-color: #e2e2e2;
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0px 2px lightgray;
  margin: 10px 0px;
}

#add-box {
  color: #f2f2f2;
  background-color: #aaaaaa;
  margin-right: 10px;
}

#bt-add-exame p {
  color: #333333;
  opacity: 0.81;
}

.sem-exames {
    h3 {
        font-weight: 350;
    }
}

#tabela-pacientes {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  width: fit-content;
}

.card-lab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f1dac4;
  width: 800px;
  height: 75px;
  margin: 5px 0px;
  border-radius: 10px;
  padding: 15px;
  text-decoration: none;
}

.card-lab p {
  color: #000;
  font-weight: 500;
}

.card-pronto {
  background-color: #0062ae;
}

.card-pronto p {
  color: white;
}

.bt-home {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f5f5;
  box-shadow: 0px 3px gray;
  border-radius: 22px;
  height: 35px;
  width: 250px;
  margin: 50px 0px;
}

.bt-home a {
  font-style: normal;
  text-decoration: none;
  color: #000;
}

footer {
  display: flex;
  position: fixed;
  bottom: 0px;
  background-color: #0062ae;
  padding: 10px;
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
}

footer p {
  text-align: center;
  color: #fff;
  font-size: 1.2rem;
}

footer a {
  color: #fff;
  text-decoration: none;
}

footer a:hover {
  color: #ffed00;
}

@media (max-width: 1024px) {
  .navbar {
    flex-direction: row;
    padding: 10px;
  }

  .user-profile {
    height: 40px;
    width: 40px;
  }

  #box-situacao .titulo {
    font-size: 2rem;
    text-align: center;
    margin: 20px 0;
  }

  #box-interacao {
    width: 100%;
    align-items: center;
  }

  #bt-add-exame {
    width: 100%;
    max-width: 200px;
    margin: 10px auto;
  }

  #barra-pesquisa {
    width: 100%;
    max-width: 400px;
    margin: 10px auto;
  }

  #barra-pesquisa input {
    width: calc(100% - 40px);
  }

  #filtros {
    width: 100%;
    max-width: 400px;
    margin: 10px auto;
  }

  #filtros p {
    font-size: 1.2rem;
  }

  #tabela-pacientes {
    width: 100%;
  }

  .card-lab,
  .card-pronto {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }

  .bt-home {
    width: 100%;
    max-width: 200px;
    margin: 20px auto;
  }
}
</style>