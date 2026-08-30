<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useChatStore, type Proposal } from '~/stores/chat'

const props = defineProps<{
  show: boolean
  proposal: Proposal | null
  isUser?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'accepted'): void
  (e: 'rejected'): void
}>()

const authStore = useAuthStore()
const chatStore = useChatStore()
const isProcessing = ref(false)

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatPrice = (price: number) =>
  'Rp ' + Number(price).toLocaleString('id-ID')

const handleAccept = async () => {
  if (!props.proposal) return
  isProcessing.value = true
  try {
    const res = await chatStore.acceptProposal(props.proposal.id)
    emit('accepted')
    if (res.midtransRedirectUrl) {
      window.location.href = res.midtransRedirectUrl
    }
  } catch (err: any) {
    alert('Gagal menyetujui proposal: ' + (err.message || err))
  } finally {
    isProcessing.value = false
  }
}

const handleReject = async () => {
  if (!props.proposal) return
  isProcessing.value = true
  try {
    await chatStore.rejectProposal(props.proposal.id)
    emit('rejected')
  } catch (err: any) {
    alert('Gagal menolak proposal: ' + (err.message || err))
  } finally {
    isProcessing.value = false
  }
}

const statusLabel: Record<string, string> = {
  PENDING: 'Menunggu Persetujuan',
  ACCEPTED: 'Proposal Disetujui',
  REJECTED: 'Proposal Ditolak'
}

const statusClass: Record<string, string> = {
  PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
  ACCEPTED: 'text-green-700 bg-green-50 border-green-200',
  REJECTED: 'text-red-700 bg-red-50 border-red-200'
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="show && proposal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <Transition name="scale">
        <div class="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] text-left">

          <!-- Close Button -->
          <button
            @click="$emit('close')"
            class="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white border border-gray-150 hover:border-gray-250 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Header -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-11 h-11 rounded-full bg-[#7A4D30]/10 text-[#7A4D30] flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 class="font-poppins text-lg font-bold text-gray-950 leading-tight">Proposal Digital</h3>
              <span
                class="inline-flex items-center gap-1 text-[10px] font-bold font-inter tracking-wide px-2.5 py-0.5 rounded-full border mt-1"
                :class="statusClass[proposal.status] || 'text-gray-600 bg-gray-50 border-gray-200'"
              >
                {{ statusLabel[proposal.status] || proposal.status }}
              </span>
            </div>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-100 mb-5"></div>

          <!-- Detail Grid -->
          <div class="space-y-4">
            <!-- Nama Produk -->
            <div>
              <p class="font-inter text-[11px] text-gray-400 font-medium uppercase tracking-wider">Nama Produk</p>
              <p class="font-poppins text-sm font-bold text-gray-950 mt-0.5">{{ proposal.productName }}</p>
            </div>

            <!-- Harga -->
            <div>
              <p class="font-inter text-[11px] text-gray-400 font-medium uppercase tracking-wider">Harga Penawaran</p>
              <p class="font-poppins text-base font-bold text-[#7A4D30] mt-0.5">{{ formatPrice(proposal.price) }}</p>
            </div>

            <!-- Material -->
            <div>
              <p class="font-inter text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1.5">Material Dibutuhkan</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="mat in proposal.materialsNeeded"
                  :key="mat"
                  class="bg-[#FAF8F5] border border-gray-100 text-gray-700 px-2.5 py-1 rounded-lg text-[11px] font-medium font-inter"
                >
                  {{ mat }}
                </span>
              </div>
            </div>

            <!-- Two-column: Delivery + Payment -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="font-inter text-[11px] text-gray-400 font-medium uppercase tracking-wider">Pengiriman</p>
                <p class="font-inter text-sm font-semibold text-gray-800 mt-0.5">
                  {{ proposal.deliveryMethod === 'DROP_OFF' ? 'Ambil Sendiri' : 'GOSEND' }}
                </p>
              </div>
              <div>
                <p class="font-inter text-[11px] text-gray-400 font-medium uppercase tracking-wider">Pembayaran</p>
                <p class="font-inter text-sm font-semibold text-gray-800 mt-0.5">{{ proposal.paymentMethod || '-' }}</p>
              </div>
            </div>

            <!-- Estimasi -->
            <div>
              <p class="font-inter text-[11px] text-gray-400 font-medium uppercase tracking-wider">Estimasi Selesai</p>
              <p class="font-inter text-sm font-semibold text-gray-800 mt-0.5">{{ formatDate(proposal.estimatedCompletionDate) }}</p>
            </div>
          </div>

          <!-- Action buttons — only for USER (not craftsman) when PENDING -->
          <div
            v-if="proposal.status === 'PENDING' && isUser"
            class="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-gray-100"
          >
            <button
              @click="handleReject"
              :disabled="isProcessing"
              type="button"
              class="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 py-3 px-4 rounded-full text-xs font-bold font-inter transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Tolak
            </button>
            <button
              @click="handleAccept"
              :disabled="isProcessing"
              type="button"
              class="bg-[#7A4D30] hover:bg-[#683E25] disabled:opacity-50 text-white py-3 px-4 rounded-full text-xs font-bold font-inter transition-all duration-200 cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Setuju
            </button>
          </div>

          <!-- Status notice when not actionable -->
          <div v-else class="mt-6 pt-5 border-t border-gray-100 flex justify-center">
            <span
              class="inline-flex items-center gap-1.5 text-[11px] font-bold font-inter px-3 py-1.5 rounded-full border"
              :class="statusClass[proposal.status] || 'text-gray-600 bg-gray-50 border-gray-200'"
            >
              <svg v-if="proposal.status === 'ACCEPTED'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {{ statusLabel[proposal.status] || proposal.status }}
            </span>
          </div>

        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.94);
  opacity: 0;
}
</style>
