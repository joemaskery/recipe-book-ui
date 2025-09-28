<template>

    <div>
        <p v-if="!recipes.length">You have no recipes, click here to add some</p>

        <DataTable v-else :value="recipes" removableSort paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 50rem">

            <Column field="name" header="Name" sortable style="width: 15%">
                <template #body="slotProps">
                    <a :href="`/recipe/${slotProps.data.recipeId}`" v-text="slotProps.data.name" />
                </template>
            </Column>

            <Column field="description" header="Description" style="width: 50%"></Column>
            <Column field="weblink" header="Link" style="width: 25%"></Column>
            <Column field="createdDate" header="Date" sortable style="width: 10%"></Column>
        </DataTable>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast'
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const router = useRouter();
const toast = useToast();

const recipes = ref([]);

onMounted(async () => {
    try {
        const token = Cookies.get("authToken");

        const response = await fetch('http://localhost:8080/recipe/get-for-user', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        recipes.value = await response.json();

    } catch (error) {
        Cookies.remove("authToken");

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Unable to load user recipes, please log in again.`,
            life: 5000
        });

        router.push("/login");
    }
});

</script>