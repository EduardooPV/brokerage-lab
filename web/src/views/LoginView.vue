<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-card__brand">
        <span class="brand-logo">◈</span>
        <span class="brand-name">Corretora Lab</span>
      </div>

      <div class="login-card__body">
        <h1>Acesse sua conta</h1>
        <p>Autenticação segura via Keycloak</p>
        <button class="btn-primary" @click="handleLogin">Entrar com SSO</button>
        <a class="register-link" @click="handleRegister">Criar nova conta</a>
      </div>

      <div class="login-card__footer">
        <span>Ambiente de laboratório</span>
      </div>
    </div>

    <div class="login-bg">
      <div class="login-bg__grid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { login, register } from '../auth/auth.service';

async function handleLogin() {
  await login();
}

async function handleRegister() {
  await register();
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f172a;
  position: relative;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.login-bg__grid {
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

.login-card {
  position: relative;
  z-index: 1;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 20px;
  width: 380px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

.login-card__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 28px;
  border-bottom: 1px solid #334155;
  background: #0f172a;
}

.brand-logo {
  font-size: 1.5rem;
  color: #f59e0b;
}

.brand-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
}

.login-card__body {
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
}

p {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: -8px;
}

.btn-primary {
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 8px;
}

.btn-primary:hover {
  background: #2563eb;
}

.register-link {
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
  transition: color 0.15s;
}

.register-link:hover {
  color: #3b82f6;
}

.login-card__footer {
  padding: 14px 28px;
  border-top: 1px solid #334155;
  background: #0f172a;
  font-size: 0.78rem;
  color: #475569;
  text-align: center;
}
</style>
