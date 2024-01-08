import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

const username = document.querySelector('#username');
const password = document.querySelector('#password');

export const url = "https://vue3-course-api.hexschool.io/";
export const path = "berlin/";

const app = createApp({
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        submit() {
            const username = this.username;
            const password = this.password;
            const data = {
                username,
                password
            }
            console.log('data', data);
            axios.post(`${url}v2/admin/signin`, data).then((res) => {
                const { token, expired } = res.data;
                document.cookie = `berlinToken=${token}; expires=${new Date(expired)};`;
                location.href = '?products.html';
                console.log('indexToken',token)
            }).catch((err) => {
                console.log(err.response);
            })
        }
    }
}).mount('#app');