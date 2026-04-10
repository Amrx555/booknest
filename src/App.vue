<template>
  <div id="app">
    <BookNavbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import BookNavbar from "@/components/BookNavbar.vue";
export default {
  name: "App",
  components: { BookNavbar },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap");

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --gold: #f0b429;
  --gold-dim: #a87b1e;
  --blue: #2563eb;
  --blue-bright: #60a5fa;
  --bg-deep: #020617;
  --bg-mid: #0f172a;
  --bg-card: rgba(255, 255, 255, 0.04);
  --text-main: #f1f5f9;
  --text-muted: #64748b;
  --border: rgba(255, 255, 255, 0.08);
  --radius: 18px;
  --radius-sm: 10px;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: "DM Sans", sans-serif;
  background: var(--bg-deep);
  color: var(--text-main);
  -webkit-font-smoothing: antialiased;
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-deep);
}
::-webkit-scrollbar-thumb {
  background: var(--gold-dim);
  border-radius: 99px;
}
</style>
