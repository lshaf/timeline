Vue.component('p-setting', {
    template: '#page-setting',
    components: {
        datepicker: vuejsDatepicker
    },
    async created() {
        this.$parent.isLoading = true;
        this.setting = this.$parent.setting;
        this.disabledDates = {
            days: this.setting.offDay,
        };

        this.$parent.isLoading = false;
    },
    data() {
        return {
            setting: {},
            disabledDates: {},
            selectedDate: new Date(),
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
        removeHoliday(holidayKey) {
            this.setting.holiday.splice(holidayKey, 1);
        },
        addDate() {
            let nValue = this.dateFormatter(this.selectedDate);
            if (this.setting.holiday.includes(nValue)) {
                return false;
            }

            this.setting.holiday.push(nValue);
        },
        back() {
            this.$parent.route = 'list';
        },
        async save() {
            this.$parent.isLoading = true;
            let resp = await Request("save/setting", this.setting);
            if (resp.success) {
                alert(resp.message);
                this.$parent.setting = resp.data;
            } else {
                alert('Something wrong! Please contact developer');
            }
            
            this.$parent.isLoading = false;
        }
    }
})