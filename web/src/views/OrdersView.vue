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
import { onMounted, reactive, ref } from 'vue';
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

onMounted(fetchOrders);
</script>

<style scoped>
.orders-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.title {
  font-size: 1.9rem;
  margin-bottom: 18px;
  color: #1f2937;
}

.order-form {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
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
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #1a73e8;
}

button[type='submit'] {
  padding: 9px 22px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  white-space: nowrap;
  align-self: flex-end;
  transition: background-color 0.15s;
}

button[type='submit']:hover:not(:disabled) {
  background-color: #1557b0;
}

button[type='submit']:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  margin: 10px 0 0;
  color: #991b1b;
  font-size: 0.88rem;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.order-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.14);
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.order-card__id {
  font-weight: 700;
  color: #111827;
}

.order-card__type {
  background: #eef2ff;
  color: #4338ca;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
}

.order-card__body {
  display: grid;
  gap: 8px;
}

.order-card__item,
.order-card__status {
  margin: 0;
  color: #374151;
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
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pill.pending {
  background: #fef3c7;
  color: #b45309;
}

.status-pill.processing {
  background: #dbeafe;
  color: #0c4a6e;
}

.status-pill.executed {
  background: #dcfce7;
  color: #166534;
}

.status-pill.failed {
  background: #fee2e2;
  color: #991b1b;
}

.empty-message {
  color: #6b7280;
  font-size: 1rem;
  margin-top: 16px;
}
</style>
