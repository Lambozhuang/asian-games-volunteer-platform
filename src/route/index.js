import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", redirect: "/index" },
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
        component: () => import("/src/category/Volunteer.vue")
      },
      {
        path: 'job',
        component: () => import("/src/category/Job.vue")
      },
      {
        path: 'team',
        component: () => import("/src/category/Team.vue")
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})