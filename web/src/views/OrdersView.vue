<template>
  <section class="orders-page">
    <h1 class="title">Ordens</h1>

    <form class="order-form" @submit.prevent="handleCreate">
      <div class="form-row">
        <div class="form-group">
          <label>Conta (ID)</label>
          <input v-model.number="form.accountId" type="number" min="1" required />
        </div>
        <div class="form-group">
          <label>Ativo (ID)</label>
          <input v-model.number="form.assetId" type="number" min="1" required />
        </div>
        <div class="form-group">
          <label>Quantidade</label>
          <input v-model.number="form.quantity" type="number" min="1" required />
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select v-model="form.type" required>
            <option value="buy">Compra</option>
            <option value="sell">Venda</option>
          </select>
        </div>
        <button type="submit" :disabled="submitting">
          {{ submitting ? 'Criando...' : 'Criar Ordem' }}
        </button>
      </div>
      <p v-if="error" class="form-error">{{ error }}</p>
    </form>

    <div v-if="orders.length > 0" class="orders-grid">
      <article v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <span class="order-card__id">#{{ order.id }}</span>
          <span class="order-card__type">{{ order.type }}</span>
        </div>
        <div class="order-card__body">
          <p class="order-card__item"><strong>Ativo:</strong> {{ order.assetName }}</p>
          <p class="order-card__item"><strong>Quantidade:</strong> {{ order.quantity }}</p>
          <p class="order-card__status">
            <strong>Status:</strong>
            <span :class="['status-pill', order.status.toLowerCase()]">{{ order.status }}</span>
          </p>
        </div>
      </article>
    </div>

    <p v-else class="empty-message">Não há ordens para exibir.</p>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { createOrder, getOrders } from '../services/orders.service';
import { generateIdempotencyKey } from '../utils/uuid';
import type { IGetOrdersResponse } from '../types/order';

const orders = ref<IGetOrdersResponse[]>([]);
const submitting = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  accountId: 1,
  assetId: 1,
  quantity: 1,
  type: 'buy',
});

let pollingInterval: ReturnType<typeof setInterval>;

const fetchOrders = async () => {
  try {
    const response = await getOrders();
    orders.value = response;
  } catch (e) {
    console.error(e);
  }
};

const handleCreate = async () => {
  submitting.value = true;
  error.value = null;
  const idempotencyKey = generateIdempotencyKey();

  try {
    await createOrder(
      {
        accountId: form.accountId,
        assetId: form.assetId,
        quantity: form.quantity,
        type: form.type,
      },
      idempotencyKey,
    );
    await fetchOrders();
  } catch (e) {
    error.value = 'Erro ao criar ordem. Verifique os dados e tente novamente.';
    console.error(e);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchOrders()
  pollingInterval = setInterval(async () => {
    await fetchOrders()

    const hasActiveOrders = orders.value.some(
      order => order.status.toLowerCase() === 'pending' || order.status.toLowerCase() === 'processing'
    )

    if (!hasActiveOrders) {
      clearInterval(pollingInterval)
    }
  }, 3000);
});

onUnmounted(() => {
  clearInterval(pollingInterval);
})
</script>

<style scoped>
.orders-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 36px 24px;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #f1f5f9;
}

.order-form {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 28px;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 100px;
}

.form-group label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.form-group input,
.form-group select {
  padding: 9px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 0.92rem;
  color: #f1f5f9;
  outline: none;
  transition: border-color 0.15s;
}

.form-group select option {
  background: #1e293b;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
}

button[type='submit'] {
  padding: 9px 22px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
  transition: background 0.15s;
}

button[type='submit']:hover:not(:disabled) {
  background: #2563eb;
}

button[type='submit']:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-error {
  margin: 10px 0 0;
  color: #f87171;
  font-size: 0.85rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.order-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 14px;
  padding: 18px;
  transition: transform 0.15s, border-color 0.15s;
}

.order-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.order-card__id {
  font-weight: 700;
  color: #94a3b8;
  font-size: 0.85rem;
}

.order-card__type {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.order-card__body {
  display: grid;
  gap: 8px;
}

.order-card__item,
.order-card__status {
  margin: 0;
  color: #94a3b8;
  font-size: 0.88rem;
}

.order-card__item strong,
.order-card__status strong {
  color: #cbd5e1;
}

.order-card__status {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pill.pending {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

.status-pill.processing {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.status-pill.executed {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.status-pill.failed {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.empty-message {
  color: #475569;
  font-size: 0.95rem;
  margin-top: 16px;
}
</style>
