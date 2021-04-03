Vue.component('p-form', {
    template: "#page-form",
    components: {
        datepicker: vuejsDatepicker
    },
    props: {
        timeline: Object
    },
    data() {
        let self = this;
        let defaultSetting = {
            offDay: [6, 0],
            holiday: ["2021-04-02", "2021-04-07", "2021-04-08", "2021-04-09"],
        };

        let setup = Object.assign(defaultSetting, this.$parent.setting);

        return {
            setting: setup,
            activeKey: null,
            disabledDates: {
                days: setup.offDay,
                customPredictor (date) {
                    let dateNow = self.dateFormatter(date);
                    return setup.holiday.includes(dateNow);
                }
            },
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
    created() {
        let p = this.dateFormatter(new Date()).replace("-", "");
        let r = Math.ceil(Math.random() * Math.pow(10, 12));

        let defaultTimeline = {
            id: p + String(r).padStart(12, "0"),
            name: "",
            schedules: [
                Object.assign({}, this.defaultSchedule)
            ]
        };

        this.timeline = Object.assign(defaultTimeline, this.timeline);
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
                manDays--;
        
                fmtEd = this.dateFormatter(endDate);
                if (
                    this.setting.holiday.includes(fmtEd) 
                    || this.setting.offDay.includes(endDate.getDay())
                ) {
                    manDays++;
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
        addSchedule() {
            this.timeline.schedules.push(Object.assign({}, this.defaultSchedule));
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
        save() {
            console.log('saved', this.timeline.schedules);
        }
    }
})