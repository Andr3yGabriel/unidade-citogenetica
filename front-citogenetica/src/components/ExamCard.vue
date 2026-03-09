<template>
  <li
    class="card-lab"
    :class="{ 'card-pronto': exam.status.title === 'Laudo Disponível' }"
    @click="handleClick"
  >
    <span class="info-paciente">
      <p>{{ exam.patient_name }}</p>
      <p>{{ exam.registrationDate }}</p>
    </span>
    <span class="status">
      <p>{{ exam.status.title }}</p>
    </span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

interface DisplayExam {
  id: number;
  patient_name: string;
  registrationDate: string;
  status: {
    name: string;
    title?: string;
  }
}

export default defineComponent({
  name: 'ExamCard',
  props: {
    exam: {
      type: Object as PropType<DisplayExam>,
      required: true,
    },
  },
  emits: ['exam-click'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('exam-click', props.exam.id, props.exam.status);
    };

    return {
      handleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
@use '../assets/styles/variables' as *;

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
  cursor: pointer;

  p {
    color: #000;
    font-weight: 500;
  }

  &.card-pronto {
    background-color: $primary-color;

    p {
      color: white;
    }
  }
}

@media (max-width: 1024px) {
  .card-lab,
  .card-pronto {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
  }
}
</style>
