<template>
  <Button @click="goBack" icon="pi pi-chevron-left" :label="label" severity="secondary" class="bt-voltar" rounded />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from 'primevue';

export default defineComponent({
  name: 'BackButton',
  components: {
    Button,
  },
  props: {
    label: {
      type: String,
      default: 'Voltar',
    },
    to: {
      type: String,
      required: true,
    },
    beforeNavigate: {
      type: Function,
      default: () => {},
    },
  },
  setup(props) {
    const router = useRouter();

    const goBack = () => {
      props.beforeNavigate();
      router.push(props.to);
    };

    return {
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.bt-voltar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e8e5e5;
  box-shadow: 0px 2px gray;
  border-radius: 22px;
  height: 35px;
  width: 100px;
}
</style>