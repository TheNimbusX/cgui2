<script setup lang="ts">
  const { message } = useToast()
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-3"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="message"
      class="fixed inset-x-4 bottom-6 z-[60] mx-auto w-fit max-w-[92vw] rounded-card border border-line bg-surface px-4 py-3 text-sm font-medium shadow-pop max-lg:bottom-[76px]"
      role="status"
    >
      {{ message }}
    </div>
  </Transition>
</template>
