import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/LandingPage.vue";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import DoctorList from "../components/DoctorList.vue";
import AddExamFile from "../components/AddExamFile.vue";
import Result from "../components/Result.vue";
import PatientList from "../components/PatientList.vue";
import AllExamsList from "../components/AllExamsList.vue";
import BuscaPaciente from "../components/BuscaPaciente.vue";
import RequestExam from "../pages/RequestExam.vue";
import AdminPanel from "../components/AdminPanel.vue";

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
    },
    {
        path: '/BuscaPaciente',
        name: 'BuscaPaciente',
        component: BuscaPaciente
    },
    {
    path: '/RequestExam',
    name: 'RequestExam',
    component: RequestExam
    },
    {
    path: '/AdminPanel',
    name: 'AdminPanel',
    component: AdminPanel
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;