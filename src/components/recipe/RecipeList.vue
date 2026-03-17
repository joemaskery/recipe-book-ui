<template>

    <div>
        <p v-if="!recipes.length">
            You have no recipes.
        </p>

        <RecipeTable v-else :recipes="recipes" />

    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import RecipeTable from '@/components/recipe/RecipeTable.vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from "vue-router"
import Cookies from "js-cookie"

const router = useRouter()
const toast = useToast()

const recipes = ref([])

onMounted(async () => {
    try {
        const token = Cookies.get("authToken")

        const response = await fetch(
            "http://localhost:8080/recipe/get-for-user",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        recipes.value = await response.json()

    } catch (error) {

        Cookies.remove("authToken")

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Unable to load user recipes, please log in again.`,
            life: 5000
        })

        router.push("/login")
    }
})
</script>