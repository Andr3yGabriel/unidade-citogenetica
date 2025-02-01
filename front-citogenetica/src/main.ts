import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';
import router from './router/router';
import { ToastService, Tooltip } from 'primevue';
import { definePreset } from '@primevue/themes';

const preset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        },
        secondary: {
            50: '{gray.50}',
            100: '{gray.100}',
            200: '{gray.200}',
            300: '{gray.300}',
            400: '{gray.400}',
            500: '{gray.500}',
            600: '{gray.600}',
            700: '{gray.700}',
            800: '{gray.800}',
            900: '{gray.900}',
            950: '{gray.950}'
        },
        
    }
});

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: preset,
        options: {
            darkModeSelector: 'light'
        }
    }
});
app.directive('tooltip', Tooltip);
app.use(ToastService);
app.use(router)
app.mount('#app');