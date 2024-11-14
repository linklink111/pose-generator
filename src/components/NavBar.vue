<template>
    <nav class="navbar">
      <div class="logo">Pose Generator</div>
      <ul class="menu">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/generator">Generator</router-link></li>
        <li><router-link to="/tutorials">Tutorials</router-link></li>
        <li><router-link to="/community">Community</router-link></li>
        <li><router-link to="/user-settings">User Settings</router-link></li>
      </ul>
      <div class="user">
        <button v-if="!isLoggedIn" @click="login">Login</button>
        <button v-if="isLoggedIn" @click="logout">Logout</button>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isLoggedIn: false
      };
    },
    methods: {
      login() {
        this.isLoggedIn = true;
      },
      logout() {
        this.isLoggedIn = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #333;
    color: white;
  }
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .menu {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  .menu li {
    display: inline;
    margin-right: 1rem;
  }
  .menu a {
    color: white; /* 默认颜色 */
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s; /* 平滑过渡效果 */
  }
  .menu a:hover {
    color: #ffcc00; /* 悬停时的颜色 */
  }
  .menu a.router-link-exact-active {
    color: #ffcc00; /* 激活时的颜色 */
  }
  .user button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }
  </style>