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
            holiday: ["2021-04-02"],
        };

        let setup = Object.assign(defaultSetting, this.setting);

        return {
            setting: this.$parent.setting,
            defaultSchedule: {
                description: "",
                startDate: this.dateFormatter(new Date()),
                manDays: 1,
                finishDate: ""
            },
            disabledDates: {
                days: setup.offDay,
                customPredictor (date) {
                    let dateNow = self.dateFormatter(date);
                    return setup.holiday.includes(dateNow);
                }
            },
        };
    },
    created() {
        console.log(this, this.timeline);
        let defaultTimeline = {
            id: "xxx",
            name: "",
            schedules: [this.defaultSchedule]
        };
        this.timeline = Object.assign(defaultTimeline, this.timeline);
        console.log('after', this.timeline);
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
        calculateEnd(scheduleKey) {
            let schedule = this.timeline.schedules[scheduleKey];
            let tmpDate = new Date(schedule.startDate);
            tmpDate.setDate(tmpDate.getDate() + schedule.manDays);
            return this.dateFormatter(tmpDate);
        },
        adjustDate(scheduleKey) {
            console.log('adjust');
        },
        addSchedule() {
            this.timeline.schedules.push(this.defaultSchedule);
        },
        deleteSchedule(scheduleKey) {
            this.timeline.schedules.splice(scheduleKey, 1);
        },
        finishSchedule(scheduleKey, isFinish) {
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
            console.log('saved')
        }
    }
})