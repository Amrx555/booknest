<template>
  <div class="home">
    <!-- Hero Search -->
    <div class="hero">
      <h1 class="hero-title">Discover <em>Your Next</em> Read</h1>
      <p class="hero-sub">Explore thousands of books across every genre</p>
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input
          v-model="query"
          @input="handleSearch"
          placeholder="Search books, authors, topics..."
          class="search-input"
        />
        <span v-if="query" class="clear-btn" @click="clearSearch">✕</span>
      </div>
    </div>

    <!-- Shimmer Skeleton -->
    <div v-if="loading" class="grid">
      <div class="skeleton" v-for="n in 12" :key="n">
        <div class="sk-img"></div>
        <div class="sk-body">
          <div class="sk-line long"></div>
          <div class="sk-line short"></div>
          <div class="sk-line btn-row"></div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!books.length" class="empty-state">
      <div class="empty-icon">🔎</div>
      <p>
        No books found for <strong>"{{ query }}"</strong>
      </p>
    </div>

    <!-- Grid -->
    <div v-else class="grid">
      <div
        class="card"
        v-for="(book, i) in books"
        :key="book.key"
        :style="{ animationDelay: `${(i % 12) * 50}ms` }"
      >
        <div class="image-wrap">
          <img
            :src="getImage(book)"
            @error="handleImgError"
            :alt="book.title"
            loading="lazy"
          />
          <div class="img-overlay">
            <button class="overlay-btn" @click="openBook(book)">
              📖 Preview
            </button>
          </div>
        </div>

        <div class="content">
          <button class="title-btn" @click="openBook(book)">
            {{ truncate(book.title, 40) }}
          </button>
          <p class="author">
            ✍️ {{ book.author_name ? book.author_name[0] : "Unknown Author" }}
          </p>
          <p class="year" v-if="book.first_publish_year">
            📅 {{ book.first_publish_year }}
          </p>

          <div class="actions">
            <button class="view-btn" @click="openBook(book)">📖 View</button>
            <button
              class="fav-btn"
              :class="{ active: isFavorite(book.key) }"
              @click="toggleFavorite(book)"
            >
              {{ isFavorite(book.key) ? "⭐" : "☆" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeBook",
  data() {
    return {
      query: "",
      books: [],
      loading: false,
      timer: null,
      favorites: [],
    };
  },
  mounted() {
    this.getBooks("programming");
    this.loadFavorites();
  },
  methods: {
    async getBooks(q = "programming") {
      this.loading = true;
      try {
        const res = await axios.get(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            q
          )}&limit=24`
        );
        this.books = res.data.docs || [];
      } catch (err) {
        console.error(err);
      }
      this.loading = false;
    },
    handleSearch() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getBooks(this.query.trim() || "programming");
      }, 400);
    },
    clearSearch() {
      this.query = "";
      this.getBooks("programming");
    },
    openBook(book) {
      this.$router.push({ name: "BookDetails", params: { id: book.key } });
    },
    loadFavorites() {
      this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    },
    isFavorite(key) {
      return this.favorites.some((b) => b.key === key);
    },
    toggleFavorite(book) {
      const exists = this.favorites.find((b) => b.key === book.key);
      if (exists) {
        this.favorites = this.favorites.filter((b) => b.key !== book.key);
      } else {
        this.favorites.push(book);
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    getImage(book) {
      if (!book?.cover_i)
        return "https://placehold.co/200x300/1e293b/64748b?text=No+Cover";
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
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
.home {
  padding: 0 0 60px;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 70%);
  min-height: 100vh;
}

/* Hero */
.hero {
  text-align: center;
  padding: 70px 20px 50px;
  position: relative;
}

.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(240, 180, 41, 0.08) 0%,
    transparent 65%
  );
  pointer-events: none;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #f1f5f9;
  margin-bottom: 12px;
  line-height: 1.15;
}

.hero-title em {
  font-style: italic;
  color: #f0b429;
}

.hero-sub {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 36px;
  font-weight: 300;
}

.search-wrap {
  position: relative;
  max-width: 520px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 16px 48px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(240, 180, 41, 0.2);
  border-radius: 999px;
  color: #f1f5f9;
  font-size: 15px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-input:focus {
  border-color: rgba(240, 180, 41, 0.6);
  background: rgba(255, 255, 255, 0.09);
  box-shadow: 0 0 0 4px rgba(240, 180, 41, 0.08), 0 8px 40px rgba(0, 0, 0, 0.4);
}

.search-input::placeholder {
  color: #475569;
}

.clear-btn {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  transition: color 0.2s;
}
.clear-btn:hover {
  color: #f1f5f9;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  gap: 22px;
  padding: 0 28px;
}

/* Card */
.card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.35s ease, border-color 0.3s ease;
  animation: cardReveal 0.5s ease both;
}

.card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(240, 180, 41, 0.15);
  border-color: rgba(240, 180, 41, 0.2);
}

.image-wrap {
  height: 250px;
  position: relative;
  overflow: hidden;
}

.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.card:hover .image-wrap img {
  transform: scale(1.07);
}

.img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
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
  padding: 10px 20px;
  border-radius: 999px;
  color: #020617;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transform: translateY(8px);
  transition: transform 0.3s ease;
  font-family: "DM Sans", sans-serif;
}

.card:hover .overlay-btn {
  transform: translateY(0);
}

.content {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.title-btn {
  background: none;
  border: none;
  color: #f1f5f9;
  font-weight: 600;
  font-size: 13.5px;
  text-align: left;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  line-height: 1.4;
  padding: 0;
  transition: color 0.2s;
}

.title-btn:hover {
  color: #f0b429;
}

.author,
.year {
  font-size: 11.5px;
  color: #475569;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.view-btn {
  flex: 1;
  background: #2563eb;
  border: none;
  padding: 8px;
  border-radius: 9px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: background 0.2s ease, transform 0.15s ease;
}
.view-btn:hover {
  background: #3b82f6;
  transform: scale(1.03);
}

.fav-btn {
  width: 36px;
  background: rgba(240, 180, 41, 0.08);
  border: 1px solid rgba(240, 180, 41, 0.3);
  color: #f0b429;
  border-radius: 9px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.fav-btn.active {
  background: #f0b429;
  color: #020617;
  border-color: #f0b429;
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 100px 20px;
  color: #475569;
}
.empty-icon {
  font-size: 52px;
  margin-bottom: 16px;
}
.empty-state strong {
  color: #94a3b8;
}

/* Shimmer Skeleton */
.skeleton {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  overflow: hidden;
}

.sk-img {
  height: 250px;
  background: linear-gradient(90deg, #1e293b 25%, #243044 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk-line {
  height: 10px;
  border-radius: 99px;
  background: linear-gradient(90deg, #1e293b 25%, #243044 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.sk-line.long {
  width: 80%;
}
.sk-line.short {
  width: 50%;
}
.sk-line.btn-row {
  width: 100%;
  height: 30px;
  border-radius: 9px;
  margin-top: 4px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .grid {
    padding: 0 14px;
    gap: 14px;
  }
  .hero {
    padding: 50px 16px 36px;
  }
}
</style>
