<template>
    <div class="create-recipe-container">
        <Card style="width: 50%">
            <template #title>Create a Recipe</template>

            <template #content>
                <form id="recipeForm" ref="recipeForm" @submit.prevent="submitRecipe">
                    <div class="form-grid">
                        <div class="form-field">
                            <label for="name">Recipe Name</label>
                            <InputText id="name" required v-model="recipe.name" />
                        </div>

                        <div class="form-field">
                            <label for="description">Description</label>
                            <Textarea id="description" required v-model="recipe.description" rows="3"></Textarea>
                        </div>

                        <div class="form-field">
                            <label for="instructions">Instructions</label>
                            <Textarea id="instructions" v-model="recipe.instructions" rows="5"></Textarea>
                        </div>

                        <div class="form-field">
                            <label for="weblink">Weblink</label>
                            <InputText id="weblink" v-model="recipe.weblink" />
                        </div>
                    </div>

                    <hr />

                    <div>
                        <h4>Ingredients</h4>
                        <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="ingredient-row">
                            <Select v-model="ingredient.ingredientRefId" filter :options="referenceIngredients"
                                option-label="name" option-value="id" placeholder="Name" class="name-input" />

                            <InputNumber v-model="ingredient.quantity" required placeholder="Quantity" :min="0"
                                class="quantity-input" />

                            <Dropdown v-model="ingredient.quantityType" :options="quantityTypes" option-label="value"
                                option-value="key" placeholder="Type" class="type-input" />

                            <Button icon="pi pi-times" class="p-button-danger remove-button"
                                @click="removeIngredient(index)" />
                        </div>
                        <Button label="Add Ingredient" icon="pi pi-plus" @click="addIngredient" />
                    </div>

                    <hr />

                    <Message v-if="errorMessages && errorMessages.length" severity="error">
                        <ul>
                            <li v-for="(msg, index) in errorMessages" :key="index">
                                {{ msg }}
                            </li>
                        </ul>
                    </Message>
                </form>
            </template>

            <template #footer>
                <Button type="submit" form="recipeForm" label="Submit Recipe" icon="pi pi-check" />
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import { Message } from "primevue";
import Button from "primevue/button";
import { Select } from "primevue";
import Cookies from "js-cookie";


const toast = useToast();
const router = useRouter();

const token = Cookies.get("authToken");

const recipe = ref({
    name: "",
    description: "",
    instructions: "",
    weblink: "",
    ingredients: []
});

const referenceIngredients = ref([]);
const quantityTypes = ref([]);

const errorMessages = ref([]);

function addIngredient() {
    recipe.value.ingredients.push({ ingredientRefId: null, quantity: null, quantityType: null });
}

function removeIngredient(index) {
    recipe.value.ingredients.splice(index, 1);
}

async function submitRecipe() {

    errorMessages.value = [];

    if (recipe.value.ingredients === undefined || recipe.value.ingredients.length == 0) {
        errorMessages.value.push("A recipe must have at least one ingredient");
        return;
    }

    const payload = {
        name: recipe.value.name,
        description: recipe.value.description,
        instructions: recipe.value.instructions,
        weblink: recipe.value.weblink,
        ingredients: recipe.value.ingredients
    };

    try {
        const response = await fetch('http://localhost:8080/recipe/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const recipeResult = await response.json();

        if (response.status === 400) {
            errorMessages.value = recipeResult.errors;
            return;
        }

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Successfully created recipe.`,
            life: 5000
        })

        router.push("/recipe/" + recipeResult.recipeId);

    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to create recipe, please try again.`,
            life: 5000
        });
    }
}

onMounted(async () => {
    try {
        const response = await fetch('http://localhost:8080/ingredient/get-for-user', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const refIngredientsResponse = await response.json();

        referenceIngredients.value = refIngredientsResponse.referenceIngredients;
        quantityTypes.value = refIngredientsResponse.quantityTypes;

    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
});
</script>

<style>
.create-recipe-container {
    display: flex;
    justify-content: center;
}

.form-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-field label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.form-field textarea {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
}

.ingredient-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: center;
}

.name-input {
    flex: 6 1 0;
}

.quantity-input {
    flex: 1 1 0;
}

.type-input {
    flex: 3 1 0;
}

.remove-btn {
    flex: 0 0 auto;
}
</style>