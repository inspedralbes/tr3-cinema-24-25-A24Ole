<template>
  <div class="min-h-screen bg-background pt-24 px-6 lg:px-12 pb-12">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- Header -->
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin" class="flex items-center justify-center size-12 bg-surface-200 border border-white/5 rounded-full text-white hover:bg-white/10 transition-colors">
          <span class="material-symbols-outlined">arrow_back</span>
        </NuxtLink>
        <div>
          <h1 class="text-4xl font-black uppercase tracking-widest text-white mb-2 font-display text-shadow-glow">
            Detailed <span class="text-primary">Reports</span>
          </h1>
          <p class="text-secondary text-sm tracking-wide">Financial and Occupancy Metrics</p>
        </div>
      </div>

      <div v-if="pending" class="text-center py-24 text-secondary">
        <span class="material-symbols-outlined animate-spin text-5xl">refresh</span>
        <p class="mt-4 text-sm uppercase tracking-widest">Loading reports data...</p>
      </div>

      <div v-else-if="!reportsData" class="text-center py-24 text-secondary bg-surface-200/50 rounded-3xl border border-white/5">
        <span class="material-symbols-outlined text-5xl mb-4">warning</span>
        <p class="text-sm uppercase tracking-widest">Failed to load reports data.</p>
      </div>

      <div v-else class="space-y-8">
        <!-- Top Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="glass p-8 rounded-3xl relative overflow-hidden group">
            <div class="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <span class="material-symbols-outlined text-[150px] text-success">payments</span>
            </div>
            <p class="text-secondary text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-success">account_balance_wallet</span>
              Total Revenue
            </p>
            <h3 class="text-5xl font-black text-white font-display">{{ formatCurrency(reportsData.total_revenue) }}</h3>
          </div>

          <div class="glass p-8 rounded-3xl relative overflow-hidden group">
            <div class="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <span class="material-symbols-outlined text-[150px] text-primary">event_seat</span>
            </div>
            <p class="text-secondary text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">pie_chart</span>
              Global Occupancy Rate
            </p>
            <div class="flex items-end gap-4 mt-2">
              <h3 class="text-5xl font-black text-white font-display">{{ reportsData.occupancy_rate }}%</h3>
              <p class="text-secondary pb-1">{{ reportsData.total_seats_sold }} / {{ reportsData.total_capacity }} seats</p>
            </div>
            <!-- Occupancy Bar -->
            <div class="h-3 w-full bg-surface-300 rounded-full overflow-hidden mt-6">
              <div class="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(242,13,51,0.5)]" :style="{ width: `${reportsData.occupancy_rate}%` }"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Revenue by Ticket Type -->
          <div class="glass p-8 rounded-3xl">
            <h3 class="text-xl font-black text-white mb-6 uppercase tracking-wider font-display">Revenue By Ticket Type</h3>
            
            <div v-if="!reportsData.revenue_by_ticket_type || reportsData.revenue_by_ticket_type.length === 0" class="text-secondary italic">
              No specific ticket revenue data.
            </div>
            
            <div v-else class="space-y-6">
              <div v-for="(type, index) in reportsData.revenue_by_ticket_type" :key="index" class="relative">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-white font-bold uppercase tracking-wider text-sm">{{ type.tipo }}</span>
                  <span class="text-primary font-black">{{ formatCurrency(type.revenue) }} ({{ type.count }})</span>
                </div>
                <!-- Calculate width relative to total revenue. Prevent div by zero -->
                <div class="h-12 w-full bg-surface-300 rounded-xl overflow-hidden relative">
                   <div class="absolute inset-y-0 left-0 bg-accent/80 transition-all duration-1000 flex items-center px-4" 
                        :style="{ width: `${reportsData.total_revenue > 0 ? (type.revenue / reportsData.total_revenue) * 100 : 0}%` }">
                   </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sales Evolution (Recent 30 entries) -->
          <div class="glass p-8 rounded-3xl">
            <h3 class="text-xl font-black text-white mb-6 uppercase tracking-wider font-display border-b border-white/5 pb-4">Sales Evolution</h3>
            
            <div class="max-h-[300px] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
               <div v-if="!reportsData.sales_evolution || reportsData.sales_evolution.length === 0" class="text-secondary italic">
                  No sales data over time.
               </div>
               
               <div v-for="(day, index) in reportsData.sales_evolution" :key="index" class="flex items-center justify-between p-4 bg-surface-200/50 rounded-2xl hover:bg-surface-200 transition-colors border border-transparent hover:border-white/5">
                 <div class="flex items-center gap-4">
                   <div class="size-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                     <span class="material-symbols-outlined text-sm">calendar_month</span>
                   </div>
                   <div>
                     <p class="text-white font-bold">{{ formatDate(day.date) }}</p>
                     <p class="text-secondary text-xs">{{ day.count }} Reservations</p>
                   </div>
                 </div>
                 <div class="text-right">
                   <p class="text-success font-black">{{ formatCurrency(day.revenue) }}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdmin } from '@/composables/useAdmin'
import { useRouter, useRuntimeConfig } from '#imports'

const router = useRouter()
const { isAdmin } = useAdmin()
const config = useRuntimeConfig()

// Protection if navigated directly
if (!isAdmin.value) {
  router.push('/')
}

const { data: reportsAPI, pending } = await useFetch(`${config.public.apiBase}/admin/reports`)
const reportsData = computed(() => reportsAPI.value || null)

const formatCurrency = (amount) => {
  if (!amount) return '0.00 €'
  return parseFloat(amount).toFixed(2) + ' €'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString('es-ES', options)
}

useHead({ title: 'Admin Reports - CinemaFlow' })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(242, 13, 51, 0.5);
}
</style>
