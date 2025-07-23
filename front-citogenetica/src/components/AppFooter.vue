<template>
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

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter',
});
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

footer {
  background-color: $primary-color;
  padding: 20px;
  text-align: center;
  font-size: 0.9rem;
  color: $dark-gray;
  margin-top: auto;

  a {
    color: $light-gray;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
