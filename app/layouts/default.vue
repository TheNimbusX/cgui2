<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="wrap flex-1 py-7 max-lg:py-5">
      <slot />
    </main>
    <AppFooter />
    <AppTabbar />
    <AppToast />
  </div>
</template>
