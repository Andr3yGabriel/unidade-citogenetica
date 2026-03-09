<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import apiClient from '../axiosConfig';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import BackButton from '../components/BackButton.vue';
import { Button, InputText } from 'primevue';

export default defineComponent({
    name: "ForgetPassword",
    components: {
        AppHeader,
        AppFooter,
        BackButton,
        InputText,
        Button,
    },
    setup() {
        const toast = useToast();
        const router = useRouter();
        const email = ref<string>('');

        const handleSubmit = async () => {
            if (!email.value) {
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Por favor, insira seu e-mail.'
                });
                return;
            }

            try {
                await apiClient.post('/auth/request-password-reset', { email: email.value });
                toast.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Se um e-mail correspondente for encontrado, um link de redefinição de senha será enviado.'
                });
                router.push('/Login');
            } catch (error: any) {
                const detail = error.response?.data?.message || 'Erro ao solicitar redefinição de senha.';
                toast.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: detail
                });
            }
        };

        const handleCancel = () => {
            router.push('/Login');
        };

        return {
            email,
            handleSubmit,
            handleCancel,
        };
    }
});
</script>

<template>
    <div class="page-container">
        <AppHeader />
        <div class="container">
            <BackButton to="/Login" style="position: absolute; top: 130px; left: 15px;" />
            <h2>Redefinir Senha</h2>
            <form @submit.prevent="handleSubmit">
                <div class="p-field">
                    <label for="email">E-mail:</label>
                    <InputText id="email" v-model="email" type="email" required />
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
