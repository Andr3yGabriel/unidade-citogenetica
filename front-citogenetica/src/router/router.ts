import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import DoctorList from "../pages/DoctorList.vue";
import AddExamFile from "../pages/AddExamFile.vue";
import Result from "../pages/Result.vue";
import PatientList from "../pages/PatientList.vue";
import AllExamsList from "../pages/AllExamsList.vue";
import AdminList from "../pages/AdminList.vue";
import RequestExam from "../pages/RequestExam.vue";
import AddWorker from "../pages/AddWorker.vue";
import ForgetPassword from "../pages/ForgetPassword.vue";
import PasswordReset from "../pages/PasswordReset.vue";

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
        path: '/AdminList',
        name: 'AdminList',
        component: AdminList
    },
    {
        path: '/RequestExam',
        name: 'RequestExam',
        component: RequestExam
    },
    {
        path: '/AddWorker',
        name: 'AddWorker',
        component: AddWorker
    },
    {
        path: '/ForgetPassword',
        name: 'ForgetPassword',
        component: ForgetPassword
    },
    {
        path: '/PasswordReset',
        name: 'PasswordReset',
        component: PasswordReset
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;