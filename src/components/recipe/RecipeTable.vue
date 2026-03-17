<template>
    <DataTable :value="recipes" removableSort paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]"
        tableStyle="min-width: 50rem" v-model:selection="selected" :selectionMode="selectable ? 'multiple' : null"
        dataKey="recipeId">

        <Column v-if="selectable" selectionMode="multiple" headerStyle="width: 3rem" />

        <Column field="name" header="Name" sortable style="width: 15%">
            <template #body="slotProps">
                <a :href="`/recipe/${slotProps.data.recipeId}`">
                    {{ slotProps.data.name }}
                </a>
            </template>
        </Column>

        <Column field="description" header="Description" style="width: 50%" />
        <Column field="weblink" header="Link" style="width: 25%" />
        <Column field="createdDate" header="Date" sortable style="width: 10%" />

    </DataTable>
</template>

<script setup>
import { ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const props = defineProps({
    recipes: {
        type: Array,
        required: true
    },
    selectable: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["selectionChange"])

const selected = ref([])

watch(selected, () => {
    emit(
        "selectionChange",
        selected.value.map(r => r.recipeId)
    )
})
</script>