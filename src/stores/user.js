import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    getters: {
        avatarUrl: (state) => {
            if (!state.user || !state.user.avatar) return null;
            return new URL(`../assets/${state.user.avatar}.png`, import.meta.url).href
        }
    },
    actions: {
        async fetchUser() {
            const token = Cookies.get('authToken')
            if (!token) return null

            try {
                const response = await fetch('http://localhost:8080/user/get-with-stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (!response.ok) throw new Error('Failed to fetch user')

                const data = await response.json()
                this.user = {
                    firstName: data.firstName,
                    secondName: data.secondName,
                    email: data.email,
                    avatar: data.avatar || 'chef_unknown',
                    dateJoined: data.stats.dateJoined,
                    recipesNumber: data.stats.recipes,
                    ingredientsNumber: data.stats.ingredients
                }

                console.log("fetched user for store")
            } catch (error) {
                console.error('Unable to fetch user:', error)
                Cookies.remove('authToken')
                this.user = null
            }
        },

        logout() {
            Cookies.remove('authToken')
            this.user = null
        }
    }
})
