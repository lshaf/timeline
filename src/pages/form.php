<template id="page-form">
    <div class="form">
        <div class="form-group">
            <label for="title">Judul Timeline</label>
            <input type="text" class="form-control" v-model="timeline.name">
        </div>
        <div class="form-timeline" v-for="(schedule, s_key) in timeline.schedules">
            <div class="block-activity" :key="s_key">
                <div class="main-set">
                    <textarea class="form-control" 
                        v-model="timeline.schedules[s_key].description"></textarea>
                </div>
                <div class="input-set">
                    <input type="number" class="form-control"
                        v-model="timeline.schedules[s_key].manDays">
                    <datepicker :format="customFormat" :disabled-dates="disabledDates" 
                        input-class="form-control"
                        v-model="timeline.schedules[s_key].startDate"></datepicker>
                    <input type="text" class="form-control" :value="calculateEnd(s_key)" disabled>
                </div>
                <div class="action-set">
                    <button type="button" @click="deleteSchedule(s_key)" class="btn btn-danger"
                        v-if="timeline.schedules.length > 1">Delete</button>
                    <button type="button" @click="finishSchedule(s_key, 1)" class="btn btn-success"
                        v-if="schedule.finishDate == ''">Finish</button>
                    <button type="button" @click="finishSchedule(s_key, 0)" class="btn btn-warning"
                        v-if="schedule.finishDate != ''">Unfinish</button>
                    <button type="button" @click="adjustDate(s_key)" class="btn btn-info"
                    >Adjust Date</button>
                    <button type="button" @click="addSchedule()"
                        v-if="(s_key + 1) == timeline.schedules.length" class="btn btn-main"
                        >New Schedule</button>
                </div>
            </div>
        </div>
        <div class="actions">
            <button type="button" @click="back()" class="btn btn-big btn-warning">
                Back
            </button>
            <button type="button" @click="save()" class="btn btn-big btn-main pull-right">
                Save
            </button>
        </div>
    </div>
</template>