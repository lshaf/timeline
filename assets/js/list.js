Vue.component('p-list', {
    template: "#page-list",
    data() {
        return {
            timelines: [],
            search: "",
            page: 1
        }
    },
    mounted() {
        this.$parent.isLoading = false;
    },
    methods: {
        renderPage(page = 1) {
            if (page < 1) page = 1;
            this.page = page;
        },
        openForm(id = null) {
            this.$parent.route = 'form';
        }
    }
});
