const app = new Vue({
    el: "#app",
    data: {
        route: "list",
        isLoading: true,
        activeTimeline: {},
        setting: {}
    },
    async created() {
        let serverSetting = await Request("get/setting");
        this.setting = serverSetting.data;
    }
});