<template>
    <div class="login-container">
        <Card style="width: 25rem; overflow: hidden">
            <template #title>Please Log In</template>

            <template #content>
                <form @submit.prevent="login">
                    <InputGroup class="field">
                        <InputGroupAddon>
                            <i class="pi pi-at"></i>
                        </InputGroupAddon>
                        <InputText id="email" v-model="email" type="email" required placeholder="Email Address" />
                    </InputGroup>

                    <InputGroup class="field">
                        <InputGroupAddon>
                            <i class="pi pi-key"></i>
                        </InputGroupAddon>
                        <Password id="password" v-model="password" required toggleMask :feedback="false"
                            placeholder="Password" />
                    </InputGroup>


                    <Button type="submit" class="field" :disabled="isLoading">
                        {{ isLoading ? 'Logging In...' : 'Log In' }}
                    </Button>

                    <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

                </form>
            </template>

            <template #footer>
                <p>Don't have an account? <router-link to="/register">Sign up here</router-link></p>
            </template>
        </Card>
    </div>
</template>

<script setup>
import Card from "primevue/card";
import { InputText } from "primevue";
import { Button } from "primevue";
import Password from 'primevue/password';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { Message } from "primevue";
import { useToast } from 'primevue/usetoast'
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import { ref } from "vue";

const email = ref("");
const password = ref("");

const isLoading = ref(false);
const errorMessage = ref(null);

const router = useRouter();
const toast = useToast();

const login = async () => {

    isLoading.value = true;
    errorMessage.value = null;

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        });

        if (response.ok) {
            const result = await response.json();

            // expires in 7 days
            Cookies.set("authToken", result.token, { expires: 7, secure: true, sameSite: "Strict" });

            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Logged in as ${email.value}`,
                life: 5000
            })

            router.push("/user")

        } else if (response.status === 401) {
            errorMessage.value = 'Incorrect email or password.';

        } else {
            errorMessage.value = 'Login failed. Please try again.';
        }

    } catch (error) {
        errorMessage.value = 'Login failed. Please try again.';

    } finally {
        isLoading.value = false;
    }
};
</script>

<style>
.p-card-title {
    margin-bottom: 1rem;
}

.login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 75vh;
}

.field {
    margin-bottom: 1rem;
    width: 100%;
    display: block;
}

.p-password .p-password-input {
    width: 100%
}
</style>
