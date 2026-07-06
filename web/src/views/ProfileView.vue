<template>
  <div class="profile">
    <h1>Perfil</h1>
    <p class="subtitle">Dados da sessão autenticada</p>

    <div class="profile-card">
      <div class="profile-card__header">
        <div class="avatar">{{ initials }}</div>
        <div>
          <p class="profile-card__name">{{ username }}</p>
          <p class="profile-card__email">{{ email }}</p>
        </div>
      </div>

      <div class="divider" />

      <div class="roles">
        <span class="roles__label">Roles</span>
        <div class="roles__list">
          <span v-for="role in roles" :key="role" class="role-pill">{{ role }}</span>
          <span v-if="roles.length === 0" class="role-pill muted">sem roles</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getUserRoles } from '../auth/auth.service';

function parseToken() {
  const token = sessionStorage.getItem('access-token');
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

const payload = parseToken();
const username = computed(() => payload.preferred_username ?? payload.sub ?? '—');
const email = computed(() => payload.email ?? '—');
const roles = computed(() => getUserRoles().filter((r) => !r.startsWith('default-roles')));
const initials = computed(() =>
  username.value
    .split(/[\s._-]/)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join(''),
);
</script>

<style scoped>
.profile {
  max-width: 560px;
  margin: 0 auto;
  padding: 36px 24px;
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
  margin-bottom: 28px;
}

.profile-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile-card__name {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
}

.profile-card__email {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 2px;
}

.divider {
  height: 1px;
  background: #334155;
  margin: 20px 0;
}

.roles {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.roles__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.roles__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-pill {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.role-pill.muted {
  background: #1e293b;
  color: #475569;
  border-color: #334155;
}
</style>
