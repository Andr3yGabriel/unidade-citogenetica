<script lang="ts">
import Toast from "primevue/toast";

export default {
  name: "App",
  components: {
    Toast,
  },
};
</script>

<template>
  <div id="app">
    <Toast :life="5000" />
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap");
* {
  font-family: "Jost", sans-serif;
}

body {
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

footer {
  display: flex;
  background-color: #0062ae;
  padding: 10px;
  height: 40px;
  width: 100%;
  margin-top: 10px;
  justify-content: center;
  align-items: center;

  p {
    text-align: center;
    color: #fff;
    font-size: 1.2rem;
  }

  a {
    color: #fff;
    text-decoration: none;

    &:hover {
      color: #ffed00;
    }
  }
}

.disabled {
  pointer-events: none;
  opacity: 0.5;
}
</style>
