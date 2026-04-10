import { createRouter, createWebHistory } from "vue-router";

// الصفحات
import HomeBook from "@/views/HomeBook.vue";
import BookDetails from "@/views/BookDetails.vue";
import FavoritesBook from "@/views/FavoritesBook.vue";

const routes = [
  {
    path: "/",
    name: "HomeBook",
    component: HomeBook,
  },
  {
    path: "/book/:id",
    name: "BookDetails",
    component: BookDetails,
    props: true,
  },

  // لو حد دخل رابط غلط
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },

  {
    path: "/favorites",
    name: "Favorites",
    component: FavoritesBook,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
