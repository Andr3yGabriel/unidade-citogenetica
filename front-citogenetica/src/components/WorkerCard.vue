<template>
    <li class="card-worker">
        <div class="worker-info">
            <p class="worker-name">{{ worker.name }}</p>
            <p class="worker-role">{{ worker.role }}</p>
        </div>
        <div class="icons">
            <ion-icon v-if="worker.isActive" name="close-circle-outline" @click.stop="$emit('deactivate')"></ion-icon>
            <ion-icon v-else name="reload-circle-outline" @click.stop="$emit('activate')"></ion-icon>
            <ion-icon name="pencil-outline"></ion-icon>
        </div>
    </li>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  
  interface DisplayWorker {
    id: number;
    name: string;
    role: string;
    isActive: boolean;
  }
  
  export default defineComponent({
    name: 'WorkerCard',
    props: {
      worker: {
        type: Object as PropType<DisplayWorker>,
        required: true,
      },
    },
    emits: ['activate', 'deactivate'],
  });
  </script>
  
  <style lang="scss" scoped>
  @use '../assets/styles/variables' as *;
  
  .card-worker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: $primary-color;
    width: 800px;
    height: 75px;
    margin: 5px 0px;
    border-radius: 10px;
    padding: 0 25px;
    text-decoration: none;

    .worker-info {
        text-align: left;
    }
  
    .worker-name {
      color: white;
      font-weight: 600;
    }

    .worker-role {
      color: white;
      font-weight: 400;
    }

    .icons {
      display: flex;
      align-items: center;
      gap: 10px;
      color: white;

      ion-icon {
        font-size: 26px;
        cursor: pointer;
      }
    }
  }
  
  @media (max-width: 1024px) {
    .card-worker {
      width: 100%;
      max-width: 400px;
      flex-direction: column;
      align-items: flex-start;
      padding: 10px;
    }
  }
  </style>
  