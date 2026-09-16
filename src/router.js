import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";
import UserLogin from "./components/user/UserLogin.vue";
import UserRegister from "./components/user/UserRegister.vue";
import UserSummary from "./components/user/UserSummary.vue";
import RecipeList from "./components/recipe/RecipeList.vue";
import RecipeDetails from "./components/recipe/RecipeDetails.vue";
import CreateRecipe from "./components/recipe/CreateRecipe.vue";
import CreateShoppingList from "./components/shopping-list/CreateShoppingList.vue";
import EditShoppingList from "./components/shopping-list/EditShoppingList.vue";
import ViewShoppingList from "./components/shopping-list/ViewShoppingList.vue";
import ViewUserShoppingLists from "./components/shopping-list/ViewUserShoppingLists.vue";

const routes = [
    { path: "/", redirect: "/user" },
    { path: "/login", component: UserLogin },
    { path: "/register", component: UserRegister },
    { path: "/user", component: UserSummary, meta: { requiresAuth: true } },
    { path: "/recipe/all", component: RecipeList, meta: { requiresAuth: true } },
    { path: "/recipe/:recipeId", component: RecipeDetails, props: true, meta: { requiresAuth: true } },
    { path: "/recipe/create", component: CreateRecipe, meta: { requiresAuth: true } },
    { path: "/shopping-list/create", component: CreateShoppingList, meta: { requiresAuth: true } },
    { path: "/shopping-list/edit/:shoppingListId", component: EditShoppingList, props: true, meta: { requiresAuth: true } },
    { path: "/shopping-list/view/:shoppingListId", component: ViewShoppingList, props: true, meta: { requiresAuth: true } },
    { path: "/shopping-list/all", component: ViewUserShoppingLists, meta: { requiresAuth: true } }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const token = Cookies.get("authToken"); // Get token from cookies

    if (to.meta.requiresAuth && !token) {
        // If route requires authentication & no token, redirect to login
        next("/login");
    } else {
        next(); // Continue to the route
    }
});

export default router;
