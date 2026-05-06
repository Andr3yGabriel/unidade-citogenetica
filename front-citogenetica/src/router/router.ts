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
import AdminPanel from "../components/AdminPanel.vue";

const routes = [
    { path: '/', name: 'LandingPage', component: LandingPage },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register },
    { path: '/ForgetPassword', name: 'ForgetPassword', component: ForgetPassword },
    { path: '/PasswordReset', name: 'PasswordReset', component: PasswordReset },
    { path: '/DoctorList',   name: 'DoctorList',   component: DoctorList,   meta: { requiresAuth: true, roles: ['medico'] } },
    { path: '/AllExamsList', name: 'AllExamsList', component: AllExamsList, meta: { requiresAuth: true, roles: ['tecnico', 'admin'] } },
    { path: '/PatientList',  name: 'PatientList',  component: PatientList,  meta: { requiresAuth: true, roles: ['paciente'] } },
    { path: '/AdminPanel',   name: 'AdminPanel',   component: AdminPanel,   meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/AdminList',    name: 'AdminList',    component: AdminList,    meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/AddWorker',    name: 'AddWorker',    component: AddWorker,    meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/RequestExam',  name: 'RequestExam',  component: RequestExam,  meta: { requiresAuth: true, roles: ['tecnico'] } },
    { path: '/AddExamFile',  name: 'AddExamFile',  component: AddExamFile,  meta: { requiresAuth: true, roles: ['tecnico'] } },
    { path: '/Result',       name: 'Result',       component: Result,       meta: { requiresAuth: true, roles: ['medico', 'tecnico', 'admin', 'paciente'] } },
];

const roleHomeMap: Record<string, string> = {
    paciente: '/PatientList',
    tecnico:  '/AllExamsList',
    admin:    '/AdminPanel',
    medico:   '/DoctorList',
};

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, _from, next) => {
    const token    = localStorage.getItem('token');
    const userType = localStorage.getItem('userType') || '';
    const requiresAuth  = to.meta.requiresAuth as boolean | undefined;
    const allowedRoles  = to.meta.roles as string[] | undefined;

    if (requiresAuth && !token) {
        next('/Login');
        return;
    }

    if (requiresAuth && allowedRoles && !allowedRoles.includes(userType)) {
        next(roleHomeMap[userType] || '/Login');
        return;
    }

    next();
});

export default router;
