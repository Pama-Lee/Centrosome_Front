const routes = [
    {
        name: 'home',
        path: '/',
        component:()=>import('../layouts/BasicLayout.vue')
    },{
    name: 'Create Group Poll',
        path: '/createGroupPoll',
        component:()=>import('../pages/createGroupPoll.vue')
    },{
        name: 'Edit Group Poll',
        path: '/editGroupPoll',
        component:()=>import('../pages/EditGroupPoll.vue')
    },
    {
        name: 'login',
        path: '/login',
        component:()=>import('../pages/Login.vue')
    },
    {
        name: 'Poll Detail',
        path: '/pollDetail',
        component:()=>import('../pages/PollDetail.vue')
    },{
        name: 'Poll Participate',
        path: '/pollParticipate',
        component:()=>import('../pages/Participate.vue')
    }
]

export default routes;