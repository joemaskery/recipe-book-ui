<template>

    <div v-if="shoppingList">

        <h2>Edit Shopping List</h2>

        <div class="list-header">
            <label>Name</label>
            <InputText v-model="shoppingList.name" />
        </div>

        <DataTable :value="shoppingList.items" tableStyle="min-width: 50rem">

            <Column header="Item">
                <template #body="{ data }">
                    <InputText v-model="data.name" />
                </template>
            </Column>

            <Column header="Quantity">
                <template #body="{ data }">
                    <InputNumber v-model="data.quantity" :min="0" />
                </template>
            </Column>

            <Column header="Type">
                <template #body="{ data }">
                    <Dropdown v-model="data.quantityType" :options="quantityTypes" />
                </template>
            </Column>

            <Column header="Category">
                <template #body="{ data }">
                    <InputText v-model="data.category" />
                </template>
            </Column>

            <Column header="">
                <template #body="slotProps">
                    <Button icon="pi pi-trash" severity="danger" text @click="removeItem(slotProps.index)" />
                </template>
            </Column>

        </DataTable>

        <div class="buttons">

            <Button label="Add Item" icon="pi pi-plus" @click="addItem" />

            <Button label="Save" icon="pi pi-check" severity="success" @click="saveShoppingList" />

        </div>

    </div>

    <p v-else>Loading shopping list...</p>

</template>


<script setup>
import { ref, onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { useRouter } from "vue-router"
import Cookies from "js-cookie"

import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Button from "primevue/button"
import InputText from "primevue/inputtext"
import InputNumber from "primevue/inputnumber"
import Dropdown from "primevue/dropdown"

const props = defineProps({
    shoppingListId: String
})

const toast = useToast()
const router = useRouter()

const shoppingList = ref(null)

const quantityTypes = [
    "ITEMS",
    "GRAM",
    "KG",
    "ML",
    "L"
]

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

        shoppingList.value = await response.json()

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


const addItem = () => {

    shoppingList.value.items.push({
        name: "",
        quantity: null,
        quantityType: null,
        category: ""
    })

}


const removeItem = (index) => {
    shoppingList.value.items.splice(index, 1)
}


const saveShoppingList = async () => {

    try {

        const token = Cookies.get("authToken")

        const response = await fetch(
            "http://localhost:8080/shopping-list/update",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(shoppingList.value)
            }
        )

        const updated = await response.json()

        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Shopping list saved",
            life: 3000
        })

        router.push(`/shopping-list/view/${updated.id}`)

    } catch (err) {

        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to save shopping list",
            life: 5000
        })

    }

}

</script>


<style scoped>
.list-header {
    margin-bottom: 1rem;
}

.buttons {
    margin-top: 1.5rem;
    display: flex;
    gap: 1rem;
}
</style>