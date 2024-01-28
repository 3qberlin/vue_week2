import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.5/vue.esm-browser.min.js';

import { url, path } from './index.js';
import pModal from './pModal.js'
import delModal from './delModal.js'

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}
const token = getCookie('berlinToken');

if (!token) {
    window.location.href = './index.html';
}

// let productModal = null;
// let delProductModal = null;

const products = createApp({
    data() {
        return {
            productsCollects: [],
            showProducts: [],
            isNew: false,
            tempProduct: {},
            url,
            path,
            products: [],
            pagination: {}
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
                this.$refs.applyModal.openModal() // 找 refs 的 applyModal 再去開啟 元件內的 函式（openModal()）
            } else if (status === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                this.$refs.applyModal.openModal() // 套用到 edit
            } else if (status === 'delete') {
                this.tempProduct = { ...item };
                // this.$refs.delModalX.openModal()
                alert('this new one');
                this.$refs.delTarget.openModal();  // 這裡不能運作
            }
        },
        getProducts(page = 1) {
            axios.get(`${url}v2/api/${path}admin/products?page=${page}`)
                .then((res) => {
                    this.productsCollects = res.data.products;
                    const { products, pagination } = res.data;
                    this.products = products;
                    this.pagination = pagination;
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
                this.$refs.applyModal.closeModal(); // 關閉
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
                this.$refs.newOne.delClose(); // 這裡不能運作
                this.getProducts(); 
            }).catch((err) => {
                alert(err.response.data.message);
            })
        }
        

    }, mounted() {
    },
    components: {
        pModal,
        delModal
    }
})
products.component('pagination', {
    props: ['pages', 'getProducts'],
    methods: {
        changePage(num) {
            this.$emit('changePage', num);
        }
    },
    template: `
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <li class="page-item" :class="{'disabled': pages.current_page === 1}">
                    <a class="page-link" href="#" aria-label="Previous"
                        @click.prevent="changePage(pages.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li v-for="(item, index) in pages.total_pages" :key="index" class="page-item"
                    :class="{'active': item === pages.current_page}">
                    <a class="page-link" href="#" @click.prevent="getProducts(item)">{{ item }}</a>
                </li>
                <li class="page-item" :class="{'disabled': pages.current_page === 1}">
                    <a class="page-link" href="#" aria-label="Next"
                        @click.prevent="changePage(pages.current_page + 1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    `,
});
products.mount('#products');