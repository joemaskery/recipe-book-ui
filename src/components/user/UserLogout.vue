<template>
    <Button @click="logout">Log Out</button>
</template>

<script setup>
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import { Button } from "primevue";
import { useToast } from "primevue";

const router = useRouter();
const toast = useToast();


const logout = () => {
    Cookies.remove("authToken");

    toast.add({
        severity: 'success',
        summary: 'Success',
        detail: `User logged out`,
        life: 5000
    });

    router.push("/login");
};
</script>
