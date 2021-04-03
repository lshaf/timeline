<template id="page-form">
  <div class="form">
    <div class="form-group">
      <label for="title">Judul Timeline</label>
      <input type="text" class="form-control" v-model="timeline.name">
    </div>
    <div class="form-timeline" v-for="(schedule, s_key) in timeline.schedules">
      <div class="block-activity" :key="s_key">
        <div class="main-set">
          <textarea class="form-control" :disabled="isFinish(s_key)"
            v-model="schedule.description"></textarea>
        </div>
        <div class="input-set">
          <input type="number" class="form-control man-days" :disabled="isFinish(s_key)"
            v-model.number="schedule.manDays">
          <datepicker :format="customFormat" :disabled-dates="disabledDates" 
            input-class="form-control start-date" :disabled="isFinish(s_key)"
            v-model="schedule.startDate"></datepicker>
          <input type="text" class="form-control end-date" :value="calculateEnd(s_key)" disabled>
        </div>
        <div class="action-set">
          <div v-if="!isFinish(s_key)">
            <button type="button" @click="deleteSchedule(s_key)" class="btn btn-danger"
              v-if="timeline.schedules.length > 1">Delete</button>
            <button type="button" @click="finishSchedule(s_key, 1)" class="btn btn-success"
              >Finish</button>
          </div>
          <div v-else>
            <span class="finish-label">{{ schedule.finishDate }}</span>
            <button type="button" @click="finishSchedule(s_key, 0)" class="btn btn-warning"
              >Unfinish</button>
          </div>
          <button type="button" @click="adjustDate(s_key)" class="btn btn-info"
            >Adjust Date</button>
          <button type="button" @click="addSchedule()" class="btn btn-main"
            v-if="(s_key + 1) == timeline.schedules.length">New Schedule</button>
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