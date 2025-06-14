import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/LandingPage.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import DoctorList from "../components/DoctorList.vue";
import AddExamFile from "../components/AddExamFile.vue";
import Result from "../components/Result.vue";
import PatientList from "../components/PatientList.vue";
import WorkerLogin from "../components/WorkerLogin.vue";
import AllExamsList from "../components/AllExamsList.vue";

const routes = [
    {
        path: '/',
        name: 'LandingPage',
        component: LandingPage
    },
    {
        path: '/Login',
        name: 'Login',
        component: Login
    },
    {
        path: '/WorkerLogin',
        name: 'WorkerLogin',
        component: WorkerLogin
    },
    {
        path: '/Register',
        name: 'Register',
        component: Register
    },
    {
        path: '/DoctorList',
        name: 'DoctorList',
        component: DoctorList
    },
    {
        path: '/AddExamFile',
        name: 'AddExamFile',
        component: AddExamFile
    },
    {
        path: '/Result',
        name: 'Result',
        component: Result
    },
    {
        path: '/PatientList',
        name: 'PatientList',
        component: PatientList
    },
    {
        path: '/AllExamsList',
        name: 'AllExamsList',
        component: AllExamsList
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;