const app = new Vue({
    el: "#app",
    data() {
        return {
            route: "list",
            isLoading: true,
            setting: {},
            activeTimeline: {},
        };
    }
});