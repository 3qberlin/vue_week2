import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

import { url, path } from './index.js';

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
const token = getCookie('berlinToken');

if (!token) {
    window.location.href = './index.html';
}

let productModal = null;
let delProductModal = null;

const products = createApp({
    data() {
        return {
            productsCollects: [],
            showProducts: [],
            isNew: false,
            tempProduct: {},
            url,
            path
        }
    },
    created() {
        axios.defaults.headers.common['Authorization'] = token;
        this.getProducts();

    },
    methods: {
        openModal(status, item) {
            if (status === 'new') {
                this.tempProduct = {};
                this.isNew = true;
                productModal.show();
            } else if (status === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (status === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show()
            }
        },
        getProducts() {
            axios.get(`${url}v2/api/${path}admin/products/all`)
                .then((res) => {
                    this.productsCollects = res.data.products;
                }).catch((err) => {
                    console.log(err.response);
                })
        },
        updateProduct() {

            let link = `${this.url}api/${this.path}admin/product/${this.tempProduct.id}`;
            let http = 'put';

            if (this.isNew) {
                link = `${this.url}api/${this.path}admin/product`;
                http = 'post'
            }

            axios[http](link, { data: this.tempProduct }).then((res) => {
                alert(res.data.message);
                productModal.hide();
                this.getProducts();  // 取得所有產品的函式
            }).catch((err) => {
                console.log('http', this.tempProduct);
                console.log(err.response.data.message)
            })
        },
        delProduct() {
            const link = `${this.url}api/${this.path}admin/product/${this.tempProduct.id}`;

            axios.delete(link).then((res) => {
                alert(res.data.message);
                delProductModal.hide();
                this.getProducts();  // 更新資料後，重新取得所有產品的函式
            }).catch((err) => {
                alert(err.response.data.message);
            })
        }, createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    }, mounted() {
        productModal = new bootstrap.Modal(
            document.getElementById("productModal"),
            {
                keyboard: false,
                backdrop: 'static'
            }
        );
        delProductModal = new bootstrap.Modal(
            document.getElementById("delProductModal"),
            {
                keyboard: false,
                backdrop: 'static'
            }
        );
    }
}).mount('#products');