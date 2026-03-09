<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import { Button, InputText, Select } from 'primevue';

interface UserType {
    id: number;
    name: string;
}

export default defineComponent({
    name: "AddWorker",
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

        const completeName = ref('');
        const email = ref('');
        const document = ref('');
        const password = ref('');
        const selectedUserType = ref<number | null>(null);
        const userTypes = ref<UserType[]>([]);

        const fetchUserTypes = async () => {
            try {
                const response = await apiClient.get<UserType[]>('/user-types', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                // Filtrar para incluir apenas 'tecnico', 'medico', 'admin'
                userTypes.value = response.data.filter(type => type.name !== 'paciente');
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível carregar os tipos de usuário.'
                });
            }
        };

        onMounted(fetchUserTypes);

        const handleSubmit = async () => {
            if (!completeName.value || !email.value || !document.value || !password.value || !selectedUserType.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Preencha todos os campos.'
                });
                return;
            }

            try {
                await apiClient.post('/admin/register/worker', {
                    completeName: completeName.value,
                    email: email.value,
                    document: document.value,
                    password: password.value,
                    userTypeId: selectedUserType.value
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Funcionário registrado com sucesso!'
                });
                router.push('/AdminList');

            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao registrar funcionário.'
                });
            }
        };

        const handleCancel = () => {
            router.push('/AdminList');
        };

        return {
            completeName,
            email,
            document,
            password,
            selectedUserType,
            userTypes,
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
            <h2>Registrar Novo Funcionário</h2>
            <form @submit.prevent="handleSubmit">
                <div class="p-field">
                    <label for="completeName">Nome Completo:</label>
                    <InputText id="completeName" v-model="completeName" />
                </div>
                <div class="p-field">
                    <label for="email">Email:</label>
                    <InputText id="email" v-model="email" type="email" />
                </div>
                <div class="p-field">
                    <label for="document">CPF:</label>
                    <InputText id="document" v-model="document" />
                </div>
                <div class="p-field">
                    <label for="password">Senha:</label>
                    <InputText id="password" v-model="password" type="password" />
                </div>
                <div class="p-field">
                    <label for="user-type">Tipo de Usuário:</label>
                    <Select id="user-type" v-model="selectedUserType" :options="userTypes" optionLabel="name" optionValue="id" placeholder="Selecione o tipo de funcionário" />
                </div>
                <div class="buttons">
                    <Button type="submit" label="Registrar" class="p-button-success" />
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
