Vue.component('p-form', {
    template: "#page-form",
    components: {
        datepicker: vuejsDatepicker
    },
    props: ['setting'],
    data() {
        let defaultSetting = {
            offDay: [6, 0],
            holiday: ["2021-04-02"],
        };
        let setup = Object.assign(defaultSetting, this.setting);
        let self = this;

        return {
            disabledDates: {
                days: setup.offDay,
                customPredictor (date) {
                    let dateNow = self.dateFormatter(date);
                    return setup.holiday.includes(dateNow);
                }
            },
            timeline: {
                id: "xxx",
                name: "Judul",
                schedules: [
                    {
                        description: "Coba1",
                        startDate: "2021-01-01",
                        manDays: 4,
                        finishDate: ""
                    },
                    {
                        description: "Coba 2",
                        startDate: "2021-01-05",
                        manDays: 4,
                        finishDate: ""
                    }
                ]
            }
        };
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
            let dateNow = new Date();
            this.timeline.schedules.push({
                description: "",
                startDate: this.dateFormatter(dateNow),
                manDays: 1,
                finishDate: ""
            })
        },
        deleteSchedule(scheduleKey) {
            console.log(`deleted`, scheduleKey);
        },
        finishSchedule(scheduleKey, isFinish) {
            console.log('finished', scheduleKey, isFinish)
        },
        back() {
            this.$parent.route = 'list';
        },
        save() {
            console.log('saved')
        }
    }
})