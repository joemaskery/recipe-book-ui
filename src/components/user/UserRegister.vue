<template>
    <div class="register-container">
        <Card style="width: 25rem; overflow: hidden">
            <template #title>Create an Account</template>

            <template #content>
                <form @submit.prevent="registerUser" autocomplete="please-do-not-autofill">
                    <InputGroup class="field">
                        <InputGroupAddon>
                            <i class="pi pi-id-card"></i>
                        </InputGroupAddon>
                        <InputText id="firstName" v-model="firstName" type="text" required placeholder="First Name"
                            autocomplete="please-do-not-autofill" />
                    </InputGroup>

                    <InputGroup class="field">
                        <InputGroupAddon>
                            <i class="pi pi-id-card"></i>
                        </InputGroupAddon>
                        <InputText id="secondName" v-model="secondName" type="text" required placeholder="Second Name"
                            autocomplete="do-not-autofill" />
                    </InputGroup>

                    <InputGroup class="field">
                        <InputGroupAddon>
                            <i class="pi pi-at"></i>
                        </InputGroupAddon>
                        <InputText id="email" v-model="email" type="email" required placeholder="Email Address"
                            autocomplete="please-do-not-autofill" />
                    </InputGroup>

                    <InputGroup class="field">
                        <InputGroupAddon>
                            <i class="pi pi-key"></i>
                        </InputGroupAddon>
                        <Password id="newPassword" v-model="newPassword" required toggleMask :feedback="true"
                            placeholder="Password" autocomplete="please-do-not-autofill" />
                    </InputGroup>

                    <InputGroup class="field p-invalid">
                        <InputGroupAddon>
                            <i class="pi pi-key"></i>
                        </InputGroupAddon>
                        <Password id="confirmPassword" v-model="confirmPassword" required toggleMask :feedback="false"
                            placeholder="Confirm Password" autocomplete="please-do-not-autofill"
                            :invalid="newPassword !== confirmPassword && confirmPassword !== ''" />
                    </InputGroup>

                    <div class="avatar-section">
                        <p>Select an Avatar:</p>
                        <div class="avatar-options">
                            <img src="@/assets/chef_male.png" alt="Male Chef"
                                :class="{ selected: selectedAvatar === 'chef_male' }"
                                @click="selectedAvatar = 'chef_male'" />
                            <img src="@/assets/chef_female.png" alt="Female Chef"
                                :class="{ selected: selectedAvatar === 'chef_female' }"
                                @click="selectedAvatar = 'chef_female'" />
                        </div>
                    </div>

                    <Button type="submit" class="field" :disabled="isLoading">
                        {{ isLoading ? 'Creating Account...' : 'Create Account' }}
                    </Button>

                    <Message v-if="errorMessages && errorMessages.length" severity="error">
                        <ul>
                            <li v-for="(msg, index) in errorMessages" :key="index">
                                {{ msg }}
                            </li>
                        </ul>
                    </Message>

                </form>
            </template>

            <template #footer>
                <p>Already have an account? <router-link to="/login">Log in here</router-link></p>
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
import { useToast } from "primevue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const firstName = ref('');
const secondName = ref('');
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const selectedAvatar = ref('chef_male');

const isLoading = ref(false);
const errorMessages = ref([]);

const router = useRouter();
const toast = useToast();

const registerUser = async () => {

    errorMessages.value = [];
    isLoading.value = true;

    try {
        const response = await fetch("http://localhost:8080/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstName.value,
                secondName: secondName.value,
                email: email.value,
                password: newPassword.value,
                avatar: selectedAvatar.value
            }),
        });

        if (response.ok) {
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: `Account created for ${email.value} - please log in`,
                life: 5000
            })

            router.push("/login");

        } else if (response.status === 400) {
            const result = await response.json();

            errorMessages.value = result.errors;

        } else {
            errorMessages.value = 'Account creation failed. Please try again.';
        }

    } catch (error) {
        errorMessages.value = 'Account creation failed. Please try again.';

    } finally {
        isLoading.value = false;
    }
};
</script>

<style>
.p-card-title {
    margin-bottom: 1rem;
}

.p-message-text {
    text-align: center;
    width: 100%;
}

.register-container {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto
}

.field {
    margin-bottom: 1rem;
    width: 100%;
    display: block;
}

.p-password .p-password-input {
    width: 100%
}

.avatar-section {
    margin-bottom: 1rem;
}

.avatar-options {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.avatar-options img {
    width: 80px;
    height: 80px;
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
}

.avatar-options img.selected {
    border-color: #42b983;
    /* highlight color */
}
</style>
