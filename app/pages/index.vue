<script setup lang="ts">
const stack = ['Nuxt', 'TypeScript', 'Pinia', 'Tailwind CSS']
</script>

<template>
  <main class="min-h-screen bg-slate-950 px-6 py-16 text-slate-100 sm:px-10">
    <section class="mx-auto max-w-3xl">
      <p class="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">
        Project foundation
      </p>
      <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
        Nuxt is ready for feature development.
      </h1>
      <p class="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
        A local, TypeScript-first setup with Pinia and Tailwind CSS configured for the next step.
      </p>

      <ul class="mt-10 grid gap-3 sm:grid-cols-2" aria-label="Configured technologies">
        <li
          v-for="technology in stack"
          :key="technology"
          class="rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-4 font-medium shadow-sm"
        >
          {{ technology }}
        </li>
      </ul>
    </section>
  </main>
</template>
