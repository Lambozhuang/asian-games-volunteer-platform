import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/index" },
  {
    path: "/login",
    name: "login",
    component: () => import("/src/Login.vue"),
  },
  {
    path: "/index",
    name: "index",
    component: () => import("/src/Index.vue"),
    children: [
      {
        name: "volunteer",
        path: "volunteer",
        component: () => import("/src/category/Volunteer.vue"),
      },
      {
        name: "job",
        path: "job",
        component: () => import("/src/category/Job.vue"),
      },
      {
        name: "team",
        path: "team",
        component: () => import("/src/category/Team.vue"),
      },
      {
        name: "myTeam",
        path: "myTeam",
        component: () => import("/src/category/MyTeam.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
