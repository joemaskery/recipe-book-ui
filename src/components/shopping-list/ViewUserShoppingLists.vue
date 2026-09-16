<template>
    <div>
        <p v-if="!shoppingLists.length">
            You have no shopping lists.
        </p>

        <DataTable v-else :value="shoppingLists" removableSort paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]"
            tableStyle="min-width: 50rem" dataKey="id">
            <Column field="name" header="Name" sortable style="width: 25%">
                <template #body="slotProps">
                    <a :href="`/shopping-list/view/${slotProps.data.id}`">
                        {{ slotProps.data.name }}
                    </a>
                </template>
            </Column>

            <Column header="Items" style="width: 15%">
                <template #body="slotProps">
                    {{ slotProps.data.items.length }}
                    item{{ slotProps.data.items.length === 1 ? '' : 's' }}
                </template>
            </Column>

            <Column field="date" header="Date" sortable style="width: 15%" />

            <Column header="Contents" style="width: 45%">
                <template #body="slotProps">
                    {{slotProps.data.items.map(item => item.name).join(', ')}}
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()
const toast = useToast()

const shoppingLists = ref([])

onMounted(async () => {
    try {
        const token = Cookies.get("authToken")

        const response = await fetch(
            "http://localhost:8080/shopping-list/get-for-user",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        shoppingLists.value = await response.json()

    } catch (error) {

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to load user shopping lists, please try again.',
            life: 5000
        })

        router.push("/")
    }
})
</script>
