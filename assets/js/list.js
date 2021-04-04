Vue.component('p-list', {
    template: "#page-list",
    data() {
        return {
            timelines: [],
            search: "",
            page: 1
        }
    },
    async mounted() {
        this.$parent.isLoading = true;
        let list = await Request("get/timeline/list");
        this.timelines = list.data;
        this.$parent.isLoading = false;
    },
    methods: {
        renderPage(page = 1) {
            if (page < 1) page = 1;
            this.page = page;
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
            this.$parent.activeTimeline = {
                id: "yyy",
                name: "Setting",
                schedules: [
                    {
                        description: "From setting",
                        manDays: 3,
                        startDate: "2021-04-05",
                        finishDate: ""
                    }
                ]
            };

            this.$parent.route = 'form';
        }
    }
});
