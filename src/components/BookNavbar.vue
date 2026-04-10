<template>
  <nav class="navbar">
    <router-link to="/" class="logo">
      <span class="logo-icon">📚</span>
      <span class="logo-text">Book<em>Nest</em></span>
    </router-link>

    <div class="links">
      <router-link to="/" class="link" exact>
        <span class="link-icon">🏠</span>
        <span>Home</span>
      </router-link>
      <router-link to="/favorites" class="link">
        <span class="link-icon">⭐</span>
        <span>Favorites</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default { name: "BookNavbar" };
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 32px;
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(240, 180, 41, 0.12);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background 0.3s ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  font-size: 22px;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-family: "Playfair Display", serif;
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.01em;
}

.logo-text em {
  font-style: italic;
  color: #f0b429;
}

.links {
  display: flex;
  gap: 6px;
}

.link {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.25s ease;
}

.link:hover {
  color: #f1f5f9;
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.router-link-active,
.router-link-exact-active {
  color: #f0b429 !important;
  background: rgba(240, 180, 41, 0.1) !important;
  border-color: rgba(240, 180, 41, 0.25) !important;
}

.link-icon {
  font-size: 15px;
  transition: transform 0.3s ease;
}

.link:hover .link-icon {
  transform: scale(1.2);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 12px 18px;
  }
  .link span:not(.link-icon) {
    display: none;
  }
}
</style>
