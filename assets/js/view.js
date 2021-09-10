Vue.component("p-view", {
    template: "#page-view",
    props: ["timeline"],
    data() {
        var defaultFilter = 'pending';
        var all_schedule = JSON.parse(JSON.stringify(this.timeline.schedules));
        for ([idx, schedule] of all_schedule.entries()) {
            all_schedule[idx] = Object.assign(schedule, {"id": idx});
        }

        return {
            setting: this.$parent.setting,
            filter: defaultFilter,
            list_schedules: this.doFilter(all_schedule, defaultFilter),
            all_schedule: all_schedule
        }
    },
    watch: {
        filter: function(newFilter, oldFilter) {
            this.list_schedules = this.doFilter(this.all_schedule, newFilter);
        }
    },
    methods: {
        doFilter(data, filter) {
            return data.filter(function (schedule) {
                if (filter == 'pending') {
                    return schedule.finishDate == "";
                } else if (filter == 'done') {
                    return schedule.finishDate != "";
                } else {
                    return true;
                }
            })
        },
        dateFormatter(tmpDate) {
            let padMonth = `${tmpDate.getMonth() + 1}`.padStart(2, 0);
            let padDate = `${tmpDate.getDate()}`.padStart(2, 0);
            return `${tmpDate.getFullYear()}-${padMonth}-${padDate}`;
        },
        formatDateByValue(data) {
            return this.dateFormatter(new Date(data));
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
        calculateEnd(schedule) {
            return this.manDaysCalculator(schedule.manDays, schedule.startDate);
        },
        isFinish(schedule) {
            return schedule.finishDate != "";
        },
        async finishSchedule(s_key, isFinish) {
            let finish = (isFinish == 1) ? this.dateFormatter(new Date()) : "";
            this.timeline.schedules[s_key].finishDate = finish;
            this.all_schedule[s_key].finishDate = finish;

            this.$parent.isLoading = true;
            await Request("save/timeline", this.timeline);
            this.$parent.isLoading = false;
        },
        back() {
            this.$parent.route = 'list';
        },
    },
})