import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import("/src/Login.vue")
  },
  {
    path: "/index",
    name: "index",
    redirect: "/index/volunteer",
    component: () => import("/src/Index.vue"),
    children: [
      {
        path: 'volunteer',
        component: () => import("/src/VolunteerManagement.vue")
      },
      {
        path: 'job',
        component: () => import("/src/JobManagement.vue")
      },
      {
        path: 'team',
        component: () => import("/src/TeamManagement.vue")
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})