<template>
  <div class="home">
    <div class="home__header">
      <div>
        <h1>Painel</h1>
        <p class="subtitle">Bem-vindo ao seu ambiente de operações</p>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-card__label">Ambiente</span>
        <span class="stat-card__value">Laboratório</span>
      </div>
      <div class="stat-card">
        <span class="stat-card__label">Stack</span>
        <span class="stat-card__value">Vue · NestJS · .NET</span>
      </div>
      <div class="stat-card accent">
        <span class="stat-card__label">Banco</span>
        <span class="stat-card__value">PostgreSQL</span>
      </div>
    </div>

    <div class="nav-grid">
      <div class="nav-card" @click="handleOrders">
        <div class="nav-card__icon">📋</div>
        <div class="nav-card__content">
          <span class="nav-card__title">Ordens</span>
          <span class="nav-card__desc">Criar e visualizar ordens de compra e venda</span>
        </div>
        <span class="nav-card__badge admin">Admin</span>
      </div>

      <div class="nav-card" @click="router.push('/profile')">
        <div class="nav-card__icon">👤</div>
        <div class="nav-card__content">
          <span class="nav-card__title">Perfil</span>
          <span class="nav-card__desc">Informações da sua conta autenticada</span>
        </div>
      </div>
    </div>

    <p v-if="accessDenied" class="access-denied">Acesso negado: role admin necessária.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getUserRoles } from '../auth/auth.service';

const router = useRouter();
const accessDenied = ref(false);

function handleOrders() {
  const roles = getUserRoles();
  if (roles.includes('admin')) {
    router.push('/orders');
  } else {
    accessDenied.value = true;
  }
}
</script>

<style scoped>
.home {
  max-width: 900px;
  margin: 0 auto;
  padding: 36px 24px;
}

.home__header {
  margin-bottom: 32px;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f1f5f9;
}

.subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 4px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card.accent {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #1e293b 0%, #1e3a5f 100%);
}

.stat-card__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.stat-card__value {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
}

.stat-card__sub {
  font-size: 0.78rem;
  color: #475569;
  margin-top: 2px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.nav-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
  position: relative;
}

.nav-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.nav-card__icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.nav-card__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.nav-card__desc {
  font-size: 0.82rem;
  color: #64748b;
}

.nav-card__badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.nav-card__badge.admin {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.access-denied {
  margin-top: 16px;
  font-size: 0.88rem;
  color: #ef4444;
}
</style>
