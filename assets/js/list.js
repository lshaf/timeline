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
            if (id === null) this.$parent.activeTimeline = {};
            this.$parent.route = 'form';
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
