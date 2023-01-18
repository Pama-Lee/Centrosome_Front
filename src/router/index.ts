// @ts-ignore
import {createRouter,createWebHistory} from 'vue-router';
// @ts-ignore
import routes from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
