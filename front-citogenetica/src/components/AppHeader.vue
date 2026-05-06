<template>
  <nav class="navbar">
    <a @click="goToHome" class="logo-link">
      <span class="logo-letter">S</span>
      <svg class="logo-dna" viewBox="0 0 20 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4,1 C4,8 16,13 16,20 C16,27 4,32 4,39" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M16,1 C16,8 4,13 4,20 C4,27 16,32 16,39" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <line x1="3" y1="1" x2="17" y2="1" stroke="white" stroke-width="2"/>
        <line x1="15" y1="14" x2="5" y2="14" stroke="rgba(255,255,255,0.75)" stroke-width="1.5"/>
        <line x1="5" y1="26" x2="15" y2="26" stroke="rgba(255,255,255,0.75)" stroke-width="1.5"/>
        <line x1="3" y1="39" x2="17" y2="39" stroke="white" stroke-width="2"/>
      </svg>
      <span class="logo-letter">SUGEN</span>
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
  padding: 10px 20px;
  align-items: center;
  justify-content: space-between;
  background-color: $primary-color;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 1px;
  text-decoration: none;
  cursor: pointer;
}

.logo-letter {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.04em;
  line-height: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.logo-dna {
  width: 16px;
  height: 32px;
  margin: 0 2px;
}

.user-profile {
  height: 50px;
  width: 50px;
  color: white;
  font-weight: 200;
}
</style>
