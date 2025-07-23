<template>
  <nav class="navbar">
    <a @click="goToHome">
      <img
        src="../assets/logo-unidade.jpg"
        alt="Logo da unidade genética com um cromossomo desenhado"
        class="logo"
      />
    </a>
    <span v-if="isLoggedIn">
      <ion-icon name="person-circle-outline" class="user-profile"></ion-icon>
    </span>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const isLoggedIn = computed(() => !!localStorage.getItem('token'));

    const goToHome = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userType');
      router.push('/');
    };

    return {
      isLoggedIn,
      goToHome,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

.navbar {
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  background-color: $primary-color;
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
</style>
