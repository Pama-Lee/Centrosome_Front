const routes = [
    {
        name: 'home',
        path: '/',
        component:()=>import('../layouts/BasicLayout.vue')
    },{
    name: 'cGroupPoll',
        path: '/createGroupPoll',
        component:()=>import('../pages/createGroupPoll.vue')
    }
]

export default routes;