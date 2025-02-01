<script lang="ts">
  export default {
    name: 'App'
  }
</script>

<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');
  * {
    font-family: 'Jost', sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
  }
</style>
