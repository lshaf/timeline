Vue.component('p-form', {
    template: "#page-form",
    components: {
        datepicker: vuejsDatepicker
    },
    props: {
        timeline: Object
    },
    created() {
        let self = this;
        this.setting = this.$parent.setting;
        this.disabledDates = {
            days: this.setting.offDay,
            customPredictor (date) {
                let dateNow = self.dateFormatter(date);
                return self.setting.holiday.includes(dateNow);
            }
        };

        let p = this.dateFormatter(new Date()).replaceAll("-", "");
        let r = Math.ceil(Math.random() * Math.pow(10, 12));
        this.timeline = Object.assign({
            id: p + String(r).padStart(12, "0"),
            name: "",
            created: (new Date()).getTime(),
            schedules: [
                Object.assign({}, this.defaultSchedule)
            ]
        }, this.timeline);
    },
    data() {
        return {
            setting: {},
            activeKey: null,
            disabledDates: {},
        };
    },
    computed: {
        startingDate() {
            let decDate = 0;
            let current = new Date();
            if (current.getDay() == 6) decDate = 1;
            if (current.getDay() == 0) decDate = 2;

            current.setDate(current.getDate() - decDate);
            let fmtDate = this.dateFormatter(current);
            while (this.setting.holiday.includes(fmtDate)) {
                current.setDate(current.getDate() - 1);
                fmtDate = this.dateFormatter(current);
            }

            return this.dateFormatter(current);
        },
        activeSchedule() {
            activeSchedule = this.timeline.schedules[this.activeKey];
            if (activeSchedule === undefined) {
                activeSchedule = Object.assign({}, this.defaultSchedule);
            }

            return activeSchedule;
        },
        defaultSchedule() {
            return {
                description: "",
                startDate: this.startingDate,
                manDays: 1,
                finishDate: ""
            };
        }
    },
    methods: {
        dateFormatter(tmpDate) {
            let padMonth = `${tmpDate.getMonth() + 1}`.padStart(2, 0);
            let padDate = `${tmpDate.getDate()}`.padStart(2, 0);
            return `${tmpDate.getFullYear()}-${padMonth}-${padDate}`;
        },
        customFormat(date) {
            let tmpDate = new Date(date);
            return this.dateFormatter(tmpDate);
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
        adjustDate(scheduleKey) {
            let totalSch = this.timeline.schedules.length;
            let currentED = this.calculateEnd(scheduleKey);
            for (lp = (scheduleKey+1);lp < totalSch;lp++) {
                this.timeline.schedules[lp].startDate = this.manDaysCalculator(2, currentED);
                currentED = this.calculateEnd(lp);
            }
        },
        addSchedule(key) {
            let newTimeline = Object.assign({}, this.defaultSchedule);
            this.timeline.schedules.splice(key + 1, 0, newTimeline);
        },
        deleteSchedule(scheduleKey) {
            this.timeline.schedules.splice(scheduleKey, 1);
        },
        finishSchedule(scheduleKey, isFinish) {
            console.log(scheduleKey);
            let finish = (isFinish == 1) ? this.dateFormatter(new Date()) : "";
            this.timeline.schedules[scheduleKey].finishDate = finish;
        },
        isFinish(scheduleKey) {
            return this.timeline.schedules[scheduleKey].finishDate != "";
        },
        back() {
            this.$parent.route = 'list';
        },
        async save() {
            let dataTimeline = this.timeline;
            this.$parent.isLoading = true;
            let resp = await Request("save/timeline", dataTimeline);
            if (resp.success) {
                alert(resp.message)
            } else {
                alert('Something wrong! Please contact developer');
            }

            this.$parent.isLoading = false;
            this.$parent.activeTimeline = dataTimeline;
        }
    }
})