<template>
    <div class="recipe-details-container">
        <Card style="width: 50%">
            <template #header>
                <img alt="user avatar" src="../../assets/pizza.png" class="user-avatar" />
            </template>

            <template #title>
                {{ recipe.name }}
            </template>

            <template #subtitle>
                {{ recipe.createdDate }}
            </template>

            <template #content>
                {{ recipe.description }}

                <Accordion>
                    <AccordionPanel value="0">
                        <AccordionHeader>Ingredients</AccordionHeader>
                        <AccordionContent>
                            <ul class="ingredients-list">
                                <li v-for="(ingredient, index) in sortedIngredients" :key="index">
                                    <span class="ingredient-name">{{ ingredient.name }}</span> –
                                    <span>{{ ingredient.quantity }} {{ ingredient.quantityName }}</span>
                                    <span class="ingredient-category"> {{ ingredient.category }}</span>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionPanel>
                    <AccordionPanel value="1">
                        <AccordionHeader>Instructions</AccordionHeader>
                        <AccordionContent>
                            <p v-if="!recipe.instructions">This recipe has no instructions</p>
                            <p v-else>{{ recipe.instructions }}</p>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>

            </template>

            <template v-if="recipe.weblink" #footer>
                <a :href="recipe.weblink" target="_blank" rel="noopener noreferrer">
                    {{ weblinkHost }}
                </a>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import { useToast } from 'primevue/usetoast'
import { useRouter } from "vue-router";
import { useRoute } from 'vue-router';
import Cookies from "js-cookie";
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const recipe = ref({
    recipeId: '',
    userId: '',
    name: '',
    description: '',
    instructions: '',
    weblink: '',
    createdDate: '',
    ingredients: []
});

const weblinkHost = computed(() => {
    if (!recipe.value.weblink) return null;
    try {
        return new URL(recipe.value.weblink).hostname;
    } catch (err) {
        return recipe.value.weblink;
    }
});;

const sortedIngredients = computed(() => {
    if (!recipe.value.ingredients) return [];
    return [...recipe.value.ingredients].sort((a, b) => {
        // First sort by category
        const categoryA = a.category?.toLowerCase() || "";
        const categoryB = b.category?.toLowerCase() || "";
        if (categoryA < categoryB) return -1;
        if (categoryA > categoryB) return 1;

        // If same category, sort by name
        const nameA = a.name?.toLowerCase() || "";
        const nameB = b.name?.toLowerCase() || "";
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;

        return 0;
    });
});

onMounted(async () => {
    try {
        const token = Cookies.get("authToken");

        const response = await fetch(`http://localhost:8080/recipe/${route.params.recipeId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const data = await response.json();

        recipe.value = {
            recipeId: data.recipeId,
            userId: data.userId,
            name: data.name,
            description: data.description,
            instructions: data.instructions,
            weblink: data.weblink,
            createdDate: data.createdDate,
            ingredients: data.ingredients
        };

    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Unable to load recipe details, please try again.`,
            life: 5000
        });

        router.push("/recipe/all");
    }
});
</script>

<style>
.recipe-details-container {
    height: 75vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.field {
    margin-bottom: 1rem;
    width: 100%;
    display: block;
}

.user-avatar {
    width: 100%;
    max-height: 150px;
    object-fit: contain;
}

.ingredients-list {
    list-style-type: disc;
    padding-left: 1.2rem;
    margin: 0.5rem 0;
}

.ingredients-list li {
    margin-bottom: 1rem;
}

.ingredient-name {
    font-weight: 600;
}

.ingredient-category {
    color: #888;
    font-style: italic;
    margin-left: 0.5rem;
}
</style>
