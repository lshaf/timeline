<template id="page-setting">
  <div class="form">
    <div class="form-group">
      <label for="title">Holiday</label>
      <div class="input-group">
        <datepicker :format="customFormat" :disabled-dates="disabledDates" 
          input-class="form-control" v-model="selectedDate"></datepicker>
        <div class="group-addon">
          <button class="btn btn-success" type="button" @click="addDate">
              Add
          </button>
        </div>
      </div>
    </div>
    <div class="date-list">
      <span class="holiday-block" v-for="(holiday, s_key) in setting.holiday" :key="s_key">
        <span class="label">{{ holiday }}</span>
        <button type="button" class="btn btn-danger" @click="removeHoliday(s_key)">
          &times;
        </button>
      </span>
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
