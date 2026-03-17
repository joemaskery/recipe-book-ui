<template>

    <div>

        <RecipeTable v-if="recipes.length" :recipes="recipes" selectable @selectionChange="updateSelection" />

        <Button label="Create Shopping List" class="mt-3" :disabled="!selectedRecipeIds.length"
            @click="buildShoppingList" />

    </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import RecipeTable from "@/components/recipe/RecipeTable.vue"
import Button from "primevue/button"
import Cookies from "js-cookie"
import { useToast } from "primevue/usetoast"
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

const recipes = ref([]);
const selectedRecipeIds = ref([]);

const updateSelection = (ids) => {
    selectedRecipeIds.value = ids
}

onMounted(async () => {

    const token = Cookies.get("authToken")

    const response = await fetch(
        "http://localhost:8080/recipe/get-for-user",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    recipes.value = await response.json()
})

const buildShoppingList = async () => {

    const token = Cookies.get("authToken")

    try {

        const response = await fetch(
            "http://localhost:8080/shopping-list/build",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipeIds: selectedRecipeIds.value
                })
            }
        )

        const shoppingList = await response.json();

        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Shopping list created",
            life: 3000
        })

        console.log(shoppingList);

        router.push("/shopping-list/edit/" + shoppingList.id);

    } catch (err) {
        console.log(err);

        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to create shopping list",
            life: 5000
        })
    }
}

</script>