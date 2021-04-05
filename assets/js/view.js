Vue.component("p-view", {
    template: "#page-view",
    props: ["timeline"],
    data() {
        return {
            setting: this.$parent.setting,
        }
    }, 
    methods: {
        dateFormatter(tmpDate) {
            let padMonth = `${tmpDate.getMonth() + 1}`.padStart(2, 0);
            let padDate = `${tmpDate.getDate()}`.padStart(2, 0);
            return `${tmpDate.getFullYear()}-${padMonth}-${padDate}`;
        },
        manDaysCalculator(masterManDays, startDate) {
            let manDays = masterManDays - 1;
            let endDate = new Date(startDate);
            let fmtEd = this.dateFormatter(endDate);
        
            while (manDays > 0) {
                endDate.setDate(endDate.getDate() + 1);
        
                fmtEd = this.dateFormatter(endDate);
                if (
                    !this.setting.holiday.includes(fmtEd) 
                    && !this.setting.offDay.includes(endDate.getDay())
                ) {
                    manDays--;
                }
            }
        
            return fmtEd;
        },
        calculateEnd(scheduleKey) {
            let schedule = this.timeline.schedules[scheduleKey];
            return this.manDaysCalculator(schedule.manDays, schedule.startDate);
        },
        isFinish(scheduleKey) {
            return this.timeline.schedules[scheduleKey].finishDate != "";
        },
        async finishSchedule(scheduleKey, isFinish) {
            let finish = (isFinish == 1) ? this.dateFormatter(new Date()) : "";
            this.timeline.schedules[scheduleKey].finishDate = finish;

            this.$parent.isLoading = true;
            await Request("save/timeline", this.timeline);
            this.$parent.isLoading = false;
        },
        back() {
            this.$parent.route = 'list';
        },
    },
})