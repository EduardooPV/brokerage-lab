<template>
  <div class="forbidden">
    <div class="forbidden__card">
      <span class="forbidden__code">403</span>
      <h1>Acesso negado</h1>
      <p>Você não tem permissão para acessar esta área.</p>
      <button @click="router.push('/home')">Voltar ao início</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.forbidden {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.forbidden__card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.forbidden__code {
  font-size: 5rem;
  font-weight: 800;
  color: #ef4444;
  line-height: 1;
  opacity: 0.8;
}

h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
}

p {
  font-size: 0.9rem;
  color: #64748b;
}

button {
  margin-top: 8px;
  padding: 10px 24px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

button:hover {
  border-color: #3b82f6;
  color: #f1f5f9;
}
</style>
