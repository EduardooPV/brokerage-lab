<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { logout } from './auth/auth.service';

const route = useRoute();
const router = useRouter();

const showNav = computed(() => route.path !== '/login' && route.path !== '/callback');

async function handleLogout() {
  await logout();
}
</script>

<template>
  <div class="app">
    <nav v-if="showNav" class="navbar">
      <div class="navbar__brand" @click="router.push('/home')">
        <span class="navbar__logo">◈</span>
        <span class="navbar__name">Corretora Lab</span>
      </div>

      <div class="navbar__links">
        <RouterLink to="/home" class="navbar__link">Início</RouterLink>
        <RouterLink to="/orders" class="navbar__link">Ordens</RouterLink>
        <RouterLink to="/profile" class="navbar__link">Perfil</RouterLink>
      </div>

      <button class="navbar__logout" @click="handleLogout">Sair</button>
    </nav>

    <main :class="{ 'with-nav': showNav }">
      <RouterView />
    </main>
  </div>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #0f172a;
  color: #f1f5f9;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

a {
  text-decoration: none;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.navbar__logo {
  font-size: 1.4rem;
  color: #f59e0b;
}

.navbar__name {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.01em;
}

.navbar__links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.navbar__link {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #94a3b8;
  transition: color 0.15s, background 0.15s;
}

.navbar__link:hover,
.navbar__link.router-link-active {
  color: #f1f5f9;
  background: #334155;
}

.navbar__logout {
  margin-left: auto;
  padding: 7px 16px;
  background: transparent;
  border: 1px solid #475569;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.88rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.navbar__logout:hover {
  border-color: #ef4444;
  color: #ef4444;
}

main {
  flex: 1;
}

main.with-nav {
  padding-top: 60px;
}
</style>
