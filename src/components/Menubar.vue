<template>
    <Menubar :model="items">
        <template #start>
            <div class="menu-logo">
                <img src="@/assets/recipe-book.png" class="logo-image" />
                <span class="logo-text">Recipe Book</span>
            </div>
        </template>

        <template #end>
            <div>
                <router-link v-if="userStore.user" to="/user">
                    <Avatar :image="userStore.avatarUrl" shape="circle" class="user-avatar-border" />
                </router-link>

                <Avatar v-else icon="pi pi-user" shape="circle" />
            </div>
        </template>
    </Menubar>
</template>

<script setup>
import { ref } from 'vue'
import { Menubar } from 'primevue';
import Avatar from 'primevue/avatar';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();

const items = ref([
    {
        label: 'User',
        icon: 'pi pi-user',
        url: '/user'
    },
    {
        label: 'Recipes',
        icon: 'pi pi-book',
        items: [
            {
                label: 'Create',
                url: '/recipe/create'
            },
            {
                label: 'View',
                url: '/recipe/all'
            }
        ]
    },
    {
        label: 'Shopping Lists',
        icon: 'pi pi-shopping-cart'
    }
])
</script>

<style>
.menu-logo {
    display: flex;
    align-items: center;
    padding-right: 1rem;
}

.logo-image {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
}

.logo-text {
    font-weight: bold;
    font-size: 1.2rem;
}

.user-avatar-border {
    border: 2px solid #42b983;
    padding: 2px;
    border-radius: 50%;
}
</style>
