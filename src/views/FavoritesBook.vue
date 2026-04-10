<template>
  <div class="fav-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Your <em>Library</em></h1>
        <p class="page-sub">
          {{ favorites.length }} saved book{{
            favorites.length !== 1 ? "s" : ""
          }}
        </p>
      </div>

      <div class="top-actions">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="search"
            placeholder="Search favorites..."
            class="search-input"
          />
        </div>

        <button
          v-if="favorites.length"
          class="delete-btn"
          :class="{ danger: deleteMode && selected.length }"
          @click="handleDelete"
        >
          <template v-if="!deleteMode">🗑 Select</template>
          <template v-else-if="!selected.length">✕ Cancel</template>
          <template v-else>
            🗑 Delete
            {{
              selected.length === favorites.length
                ? "All"
                : `(${selected.length})`
            }}
          </template>
        </button>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!filteredFavorites.length" class="empty-state">
      <div class="empty-icon">{{ search ? "🔎" : "📚" }}</div>
      <p>
        {{ search ? `No results for "${search}"` : "Your library is empty" }}
      </p>
      <router-link v-if="!search" to="/" class="discover-btn"
        >Discover Books →</router-link
      >
    </div>

    <!-- Grid -->
    <div v-else class="grid">
      <div
        class="card"
        v-for="(book, i) in filteredFavorites"
        :key="book.key"
        :class="{
          'is-selected': selected.includes(book.key),
          'select-mode': deleteMode,
        }"
        :style="{ animationDelay: `${i * 55}ms` }"
        @click="!deleteMode && open(book)"
      >
        <!-- Checkbox -->
        <transition name="check-pop">
          <div v-if="deleteMode" class="checkbox" @click.stop="select(book)">
            <span v-if="selected.includes(book.key)">✔</span>
          </div>
        </transition>

        <div class="image-wrap">
          <img
            :src="getImage(book)"
            @error="handleImgError"
            :alt="book.title"
            loading="lazy"
          />
          <div class="img-overlay" v-if="!deleteMode">
            <button class="overlay-btn" @click.stop="open(book)">
              📖 Open
            </button>
          </div>
        </div>

        <div class="content">
          <button class="title-btn" @click.stop="open(book)">
            {{ truncate(book.title, 38) }}
          </button>
          <p class="author">
            ✍️ {{ book.author_name ? book.author_name[0] : "Unknown" }}
          </p>
          <p class="year" v-if="book.first_publish_year">
            📅 {{ book.first_publish_year }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FavoritesBook",
  data() {
    return {
      favorites: [],
      selected: [],
      deleteMode: false,
      search: "",
    };
  },
  mounted() {
    this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  },
  computed: {
    filteredFavorites() {
      const q = this.search.toLowerCase();
      return this.favorites.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(q) ||
          (b.author_name?.[0] || "").toLowerCase().includes(q)
      );
    },
  },
  methods: {
    select(book) {
      const id = book.key;
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((i) => i !== id);
      } else {
        this.selected.push(id);
      }
    },
    handleDelete() {
      if (!this.deleteMode) {
        this.deleteMode = true;
        return;
      }
      if (!this.selected.length) {
        this.deleteMode = false;
        return;
      }
      this.favorites = this.favorites.filter(
        (b) => !this.selected.includes(b.key)
      );
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
      this.selected = [];
      this.deleteMode = false;
    },
    open(book) {
      this.$router.push({ name: "BookDetails", params: { id: book.key } });
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
.fav-page {
  padding: 0 0 60px;
  background: radial-gradient(ellipse at top, #0f172a 0%, #020617 70%);
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 20px;
  padding: 52px 32px 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
}

.page-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 0%,
    rgba(240, 180, 41, 0.06) 0%,
    transparent 60%
  );
  pointer-events: none;
}

.page-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #f1f5f9;
  line-height: 1.1;
}

.page-title em {
  font-style: italic;
  color: #f0b429;
}

.page-sub {
  color: #475569;
  font-size: 14px;
  margin-top: 6px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-wrap {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  pointer-events: none;
}

.search-input {
  padding: 10px 14px 10px 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 999px;
  color: #f1f5f9;
  font-size: 13.5px;
  font-family: "DM Sans", sans-serif;
  outline: none;
  width: 220px;
  transition: all 0.25s ease;
}

.search-input:focus {
  border-color: rgba(240, 180, 41, 0.4);
  background: rgba(255, 255, 255, 0.08);
  width: 260px;
}

.search-input::placeholder {
  color: #475569;
}

.delete-btn {
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.08);
  color: #fca5a5;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.delete-btn:hover,
.delete-btn.danger {
  background: #ef4444;
  border-color: #ef4444;
  color: white;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.35);
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(195px, 1fr));
  gap: 22px;
  padding: 32px 28px 0;
}

/* Card */
.card {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease, border-color 0.3s ease;
  animation: cardReveal 0.5s ease both;
}

.card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(240, 180, 41, 0.15);
  border-color: rgba(240, 180, 41, 0.2);
}

.card.select-mode {
  cursor: default;
}

.card.is-selected {
  border-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.4),
    0 16px 40px rgba(239, 68, 68, 0.15);
}

/* Checkbox */
.checkbox {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  z-index: 2;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  transition: transform 0.2s ease;
}

.checkbox:hover {
  transform: scale(1.1);
}

.check-pop-enter-active {
  animation: checkPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.check-pop-leave-active {
  animation: checkPop 0.2s ease reverse;
}

@keyframes checkPop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Image */
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

/* Content */
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
}

/* Empty */
.empty-state {
  text-align: center;
  padding: 120px 20px;
  color: #475569;
}
.empty-icon {
  font-size: 56px;
  margin-bottom: 16px;
}
.empty-state p {
  font-size: 16px;
  margin-bottom: 24px;
}

.discover-btn {
  display: inline-block;
  padding: 12px 28px;
  background: rgba(240, 180, 41, 0.1);
  border: 1px solid rgba(240, 180, 41, 0.3);
  color: #f0b429;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.25s ease;
}

.discover-btn:hover {
  background: #f0b429;
  color: #020617;
}

@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .page-header {
    padding: 36px 16px 24px;
  }
  .grid {
    padding: 20px 14px 0;
    gap: 14px;
  }
  .search-input {
    width: 160px;
  }
  .search-input:focus {
    width: 180px;
  }
}
</style>
