Vue.component('p-list', {
    template: "#page-list",
    async created() {
        await this.renderPage()
    },
    data() {
        return {
            timelines: {},
            search: "",
            page: 1
        }
    },
    methods: {
        async renderPage(page = 1) {
            if (page < 1) page = 1;
            this.page = page;

            this.$parent.isLoading = true;
            let list = await Request("get/timeline/list");
            this.timelines = list.data;
            this.$parent.isLoading = false;
        },
        async deleteTimeline(id) {
            this.$parent.isLoading = true;
            let detail = await Request("delete/timeline", {id: id});
            if (detail.success) {
                alert(detail.message);
                this.renderPage();
            }

            this.$parent.isLoading = false;
        },
        async openForm(id = null) {
            if (id === null) this.$parent.activeTimeline = {};
            this.$parent.isLoading = true;
            
            if (id !== null) {
                let detail = await Request("get/timeline", {id: id})
                this.$parent.activeTimeline = detail.data;
            }

            this.$parent.route = 'form';
            this.$parent.isLoading = false;
        },
        openSetting() {
            this.$parent.route = 'setting';
        }
    }
});
