<template id="page-view">
  <div class="list">
    <h2>{{ timeline.name }}</h2>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th width="120px">Start Date</th>
          <th width="120px">End Date</th>
          <th width="120px">Finish Date</th>
          <th width="120px">Action</th>
        </tr>
      </thead>
      <tbody v-if="timeline.schedules.length > 0">
        <tr v-for="(schedule, s_key) in timeline.schedules" :key="s_key">
          <td class="pre-box">{{ schedule.description }}</td>
          <td class="text-center">{{ schedule.startDate }}</td>
          <td class="text-center">{{ calculateEnd(s_key) }}</td>
          <td class="text-center">{{ schedule.finishDate == "" ? "-" : schedule.finishDate }}</td>
          <td class="text-center">
            <button type="button" class="btn btn-success" 
              @click="finishSchedule(s_key, 1)" v-if="!isFinish(s_key)">Finish</button>
            <button type="button" class="btn btn-warning" 
              @click="finishSchedule(s_key, 0)" v-if="isFinish(s_key)">Undo</button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="2" class="text-center">No data available</td>
        </tr>
      </tbody>
    </table>
    <div class="actions" style="margin-top: 15px;">
      <button type="button" @click="back()" class="btn btn-big btn-warning">
        Back
      </button>
    </div>
  </div>
</template>