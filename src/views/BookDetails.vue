<template>
  <div class="details-page">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="sk-layout">
      <div class="sk-img-box"></div>
      <div class="sk-info">
        <div class="sk-line xl"></div>
        <div class="sk-line md"></div>
        <div class="sk-line sm"></div>
        <div class="sk-line lg"></div>
        <div class="sk-line lg"></div>
      </div>
    </div>

    <div v-else>
      <!-- Book Header -->
      <div class="hero-section">
        <div class="hero-bg" :style="bgStyle"></div>

        <div class="header">
          <div class="img-box">
            <img
              :src="getImage(book)"
              @error="handleImgError"
              :alt="book.title"
            />
            <div class="img-glow"></div>
          </div>

          <div class="info">
            <div class="badges">
              <span class="badge" v-if="book.subject_places?.length"
                >📍 {{ book.subject_places[0] }}</span
              >
              <span class="badge accent" v-if="book.first_publish_date"
                >📅 {{ book.first_publish_date }}</span
              >
            </div>

            <h1 class="title">{{ book.title }}</h1>

            <p class="author" v-if="book.authors?.length">
              by {{ book.authors.map((a) => a.name).join(", ") }}
            </p>

            <p class="desc">
              {{
                book.description?.value ||
                book.description ||
                "No description available for this book."
              }}
            </p>

            <div class="actions-row">
              <a
                class="btn primary"
                :href="openLink"
                target="_blank"
                rel="noopener"
              >
                🌍 Read on OpenLibrary
              </a>
              <button class="btn ghost" @click="$router.back()">← Back</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Books -->
      <div class="related-section">
        <div class="section-header">
          <h2 class="section-title">📚 Related Books</h2>
          <span class="section-count">{{ related.length }} titles</span>
        </div>

        <div class="grid">
          <div
            class="card"
            v-for="(b, i) in related"
            :key="b.key"
            :style="{ animationDelay: `${i * 45}ms` }"
          >
            <div class="img-wrap">
              <img
                :src="getImage(b)"
                @error="handleImgError"
                :alt="b.title"
                loading="lazy"
              />
              <div class="img-overlay">
                <button class="overlay-btn" @click="goToBook(b)">
                  📖 View
                </button>
              </div>
            </div>

            <div class="card-content">
              <p class="card-title">{{ truncate(b.title, 36) }}</p>
              <p class="card-author">{{ b.author_name?.[0] || "Unknown" }}</p>

              <div class="card-actions">
                <button class="view-btn" @click="goToBook(b)">📖 View</button>
                <button
                  class="fav-btn"
                  :class="{ active: isFavorite(b) }"
                  @click="toggleFavorite(b)"
                >
                  {{ isFavorite(b) ? "⭐" : "☆" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-slide">
      <div v-if="toast" class="toast" :class="toast.type">
        {{ toast.msg }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "BookDetails",
  data() {
    return {
      book: {},
      related: [],
      loading: true,
      toast: null,
    };
  },
  computed: {
    openLink() {
      return this.book.key ? `https://openlibrary.org${this.book.key}` : "#";
    },
    bgStyle() {
      const cover = this.book.covers?.[0];
      if (!cover) return {};
      return {
        backgroundImage: `url(https://covers.openlibrary.org/b/id/${cover}-L.jpg)`,
      };
    },
  },
  watch: {
    "$route.params.id": "getBook",
  },
  mounted() {
    this.getBook();
  },
  methods: {
    async getBook() {
      this.loading = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
      const id = this.$route.params.id;
      try {
        const res = await axios.get(`https://openlibrary.org${id}.json`);
        this.book = res.data;
        this.getRelated();
      } catch (err) {
        console.error(err);
      }
      this.loading = false;
    },
    async getRelated() {
      try {
        const keyword = this.book.title?.split(" ")[0] || "book";
        const res = await axios.get(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            keyword
          )}&limit=12`
        );
        this.related = (res.data.docs || []).slice(0, 12);
      } catch (err) {
        console.error(err);
      }
    },
    goToBook(book) {
      this.$router.push({ name: "BookDetails", params: { id: book.key } });
    },
    getFavorites() {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    },
    isFavorite(book) {
      return this.getFavorites().some((b) => b.key === book.key);
    },
    toggleFavorite(book) {
      let fav = this.getFavorites();
      const exists = fav.find((b) => b.key === book.key);
      if (exists) {
        fav = fav.filter((b) => b.key !== book.key);
        this.showToast("❌ Removed from favorites", "remove");
      } else {
        fav.push(book);
        this.showToast("⭐ Added to favorites", "add");
      }
      localStorage.setItem("favorites", JSON.stringify(fav));
    },
    showToast(msg, type = "add") {
      this.toast = { msg, type };
      setTimeout(() => {
        this.toast = null;
      }, 2500);
    },
    getImage(book) {
      if (!book)
        return "https://placehold.co/200x300/1e293b/64748b?text=No+Cover";
      const cover = book.cover_i || book.covers?.[0];
      if (!cover)
        return "https://placehold.co/200x300/1e293b/64748b?text=No+Cover";
      return `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
    },
    handleImgError(e) {
      e.target.src = "https://placehold.co/200x300/1e293b/64748b?text=No+Cover";
    },
    truncate(str, n) {
      if (!str) return "No Title";
      return str.length > n ? str.slice(0, n) + "…" : str;
    },
  },
};
</script>

<style scoped>
.details-page {
  background: var(--bg-deep, #020617);
  min-height: 100vh;
  color: #f1f5f9;
  padding-bottom: 80px;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 60px 36px 50px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(60px) saturate(0.4);
  opacity: 0.15;
  transform: scale(1.1);
  z-index: 0;
}

.header {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 42px;
  flex-wrap: wrap;
  align-items: flex-start;
  animation: fadeUp 0.6s ease both;
}

/* Book Cover */
.img-box {
  position: relative;
  width: 220px;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
}

.img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

/* Info */
.info {
  flex: 1;
  min-width: 260px;
  padding-top: 8px;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  font-size: 12px;
  color: #94a3b8;
}

.badge.accent {
  border-color: rgba(240, 180, 41, 0.3);
  background: rgba(240, 180, 41, 0.08);
  color: #f0b429;
}

.title {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.6rem, 3.5vw, 2.6rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 10px;
  color: #f1f5f9;
}

.author {
  color: #94a3b8;
  font-size: 15px;
  margin-bottom: 18px;
  font-style: italic;
}

.desc {
  color: #cbd5e1;
  font-size: 14.5px;
  line-height: 1.75;
  max-width: 580px;
  margin-bottom: 26px;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 22px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  font-family: "DM Sans", sans-serif;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.25s ease;
}

.primary {
  background: #2563eb;
  color: white;
}

.primary:hover {
  background: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
}

.ghost {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
}

.ghost:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #f1f5f9;
  transform: translateX(-2px);
}

/* Related Section */
.related-section {
  padding: 0 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.section-title {
  font-family: "Playfair Display", serif;
  font-size: 1.5rem;
  font-weight: 700;
}

.section-count {
  color: #475569;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.05);
  padding: 3px 10px;
  border-radius: 999px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 20px;
}

/* Card */
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease, border-color 0.3s ease;
  animation: cardReveal 0.5s ease both;
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border-color: rgba(240, 180, 41, 0.2);
}

.img-wrap {
  height: 230px;
  position: relative;
  overflow: hidden;
}

.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .img-wrap img {
  transform: scale(1.07);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.card:hover .img-overlay {
  opacity: 1;
}

.overlay-btn {
  background: #f0b429;
  border: none;
  padding: 9px 18px;
  border-radius: 999px;
  color: #020617;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transform: translateY(8px);
  transition: transform 0.3s ease;
  font-family: "DM Sans", sans-serif;
}

.card:hover .overlay-btn {
  transform: translateY(0);
}

.card-content {
  padding: 12px;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.4;
  margin-bottom: 5px;
  transition: color 0.2s;
}

.card:hover .card-title {
  color: #f0b429;
}

.card-author {
  font-size: 11px;
  color: #475569;
  margin-bottom: 10px;
}

.card-actions {
  display: flex;
  gap: 7px;
}

.view-btn {
  flex: 1;
  background: #2563eb;
  border: none;
  padding: 7px;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: background 0.2s, transform 0.15s;
}
.view-btn:hover {
  background: #3b82f6;
  transform: scale(1.02);
}

.fav-btn {
  width: 34px;
  background: rgba(240, 180, 41, 0.08);
  border: 1px solid rgba(240, 180, 41, 0.3);
  color: #f0b429;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.fav-btn.active {
  background: #f0b429;
  border-color: #f0b429;
  color: #020617;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 28px;
  right: 28px;
  padding: 13px 22px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  font-family: "DM Sans", sans-serif;
  z-index: 9999;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.toast.add {
  background: rgba(37, 99, 235, 0.85);
  color: white;
}

.toast.remove {
  background: rgba(239, 68, 68, 0.85);
  color: white;
}

.toast-slide-enter-active {
  animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-slide-leave-active {
  animation: toastOut 0.3s ease forwards;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toastOut {
  to {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
}

/* Skeleton */
.sk-layout {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  padding: 60px 36px;
}

.sk-img-box {
  width: 220px;
  height: 320px;
  border-radius: 16px;
  background: linear-gradient(90deg, #1e293b 25%, #243044 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  flex-shrink: 0;
}

.sk-info {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 10px;
}

.sk-line {
  height: 12px;
  border-radius: 99px;
  background: linear-gradient(90deg, #1e293b 25%, #243044 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-line.xl {
  width: 70%;
  height: 32px;
}
.sk-line.lg {
  width: 100%;
}
.sk-line.md {
  width: 45%;
}
.sk-line.sm {
  width: 30%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 32px 16px 36px;
  }
  .img-box {
    width: 160px;
    height: 240px;
  }
  .related-section {
    padding: 0 14px;
  }
  .grid {
    gap: 14px;
  }
}
</style>
