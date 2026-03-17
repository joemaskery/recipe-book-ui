<template>

    <div class="page-container">

        <div v-if="shoppingList">

            <div class="header">

                <h2>{{ shoppingList.name }}</h2>

                <Button label="Edit" icon="pi pi-pencil" @click="goToEdit" />

            </div>

            <div v-for="(items, category) in groupedItems" :key="category" class="category-block">

                <h3>{{ category }}</h3>

                <div v-for="item in items" :key="item.name + item.quantity + item.quantityType" class="shopping-item">

                    <Checkbox v-model="item.checked" binary />

                    <span :class="{ checked: item.checked }">
                        {{ item.name }}
                    </span>

                    <span class="quantity">
                        {{ item.quantity }} {{ item.quantityType }}
                    </span>

                </div>

            </div>

        </div>

        <p v-else>Loading shopping list...</p>

    </div>

</template>


<script setup>

import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useToast } from "primevue/usetoast"
import Cookies from "js-cookie"

import Button from "primevue/button"
import Checkbox from "primevue/checkbox"

const props = defineProps({
    shoppingListId: String
})

const router = useRouter()
const toast = useToast()

const shoppingList = ref(null)

onMounted(async () => {

    try {

        const token = Cookies.get("authToken")

        const response = await fetch(
            `http://localhost:8080/shopping-list/get/${props.shoppingListId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const data = await response.json()

        // add checkbox state
        data.items = data.items.map(i => ({
            ...i,
            checked: false
        }))

        shoppingList.value = data

    } catch (err) {

        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to load shopping list",
            life: 5000
        })

        router.push("/")
    }

})


const groupedItems = computed(() => {

    if (!shoppingList.value?.items) return {}

    const groups = {}

    shoppingList.value.items.forEach(item => {

        if (!groups[item.category]) {
            groups[item.category] = []
        }

        groups[item.category].push(item)

    })

    // sort unchecked first
    Object.keys(groups).forEach(category => {

        groups[category].sort((a, b) => {
            return a.checked - b.checked
        })

    })

    return groups

})


const goToEdit = () => {
    router.push(`/shopping-list/edit/${props.shoppingListId}`)
}

</script>

<style scoped>
.page-container {
    width: 75%;
    max-width: 900px;
    margin: 2rem auto;
    padding: 1.5rem;

    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.category-block {
    margin-bottom: 2rem;
}

.shopping-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.4rem 0;
}

.quantity {
    margin-left: auto;
    color: #666;
}

.checked {
    text-decoration: line-through;
    opacity: 0.5;
}
</style>