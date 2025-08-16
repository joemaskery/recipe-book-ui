<template>
    <div class="user-summary-container">
        <Card style="width: 350px">
            <template #header>
                <img alt="user avatar" src="@/assets/chef_male.png" class="user-avatar" />
            </template>
            <template #title>
                {{ user.firstName }} {{ user.secondName }}
            </template>
            <template #subtitle>
                {{ user.email }}
            </template>
            <template #content>
                <p style="text-align: center;">
                    Member since: {{ user.dateJoined }} <br><br>
                    Recipes created: {{ user.recipesNumber }} <br><br>
                    Ingredients used: {{ user.ingredientsNumber }}
                </p>
            </template>

            <template #footer>
                <UserLogout class="field" />
            </template>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import UserLogout from './UserLogout.vue';
import { useToast } from 'primevue/usetoast'
import { useRouter } from "vue-router";
import Cookies from "js-cookie";

const router = useRouter();
const toast = useToast();

const user = ref({
    firstName: '',
    secondName: '',
    email: '',
    dateJoined: '',
    recipesNumber: '',
    ingredientsNumber: ''
});

onMounted(async () => {
    try {
        const token = Cookies.get("authToken");

        const response = await fetch('http://localhost:8080/user/get-with-stats', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const data = await response.json();

        user.value = {
            firstName: data.firstName,
            secondName: data.secondName,
            email: data.email,
            dateJoined: data.stats.dateJoined,
            recipesNumber: data.stats.recipes,
            ingredientsNumber: data.stats.ingredients
        };

    } catch (error) {
        Cookies.remove("authToken");

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Unable to load user details, please log in again.`,
            life: 5000
        });

        router.push("/login");
    }
});
</script>

<style>
.user-summary-container {
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
    /* fills the card width */
    max-height: 150px;
    /* keeps it from being too tall */
    object-fit: contain;
    /* preserves aspect ratio without cropping */
}
</style>
