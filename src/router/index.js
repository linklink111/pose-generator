// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import UserHome from '../views/UserHome.vue';
import PoseGenerator from '../views/PoseGenerator.vue';
import UserTutorials from '../views/UserTutorials.vue';
import UserCommunity from '../views/UserCommunity.vue';
import UserSettings from '../views/UserSettings.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: UserHome
  },
  {
    path: '/generator',
    name: 'generator',
    component: PoseGenerator
  },
  {
    path: '/tutorials',
    name: 'tutorials',
    component: UserTutorials
  },
  {
    path: '/community',
    name: 'community',
    component: UserCommunity
  },
  {
    path: '/user-settings',
    name: 'user-settings',
    component: UserSettings
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;