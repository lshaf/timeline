<template id="page-view">
  <div class="list">
    <h2>{{ timeline.name }}</h2>
    <select v-model="filter" class="status-filter">
      <option value="all">All</option>
      <option value="done">Finished</option>
      <option value="pending">Pending</option>
    </select>
    </select>
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
      <tbody v-if="list_schedules.length > 0">
        <tr v-for="schedule in list_schedules" :key="schedule.id">
          <td class="pre-box">{{ schedule.description }}</td>
          <td class="text-center">{{ formatDateByValue(schedule.startDate) }}</td>
          <td class="text-center">{{ calculateEnd(schedule) }}</td>
          <td class="text-center">{{ schedule.finishDate == "" ? "-" : schedule.finishDate }}</td>
          <td class="text-center">
            <button type="button" class="btn btn-success" 
              @click="finishSchedule(schedule.id, 1)" v-if="!isFinish(schedule)">Finish</button>
            <button type="button" class="btn btn-warning" 
              @click="finishSchedule(schedule.id, 0)" v-if="isFinish(schedule)">Undo</button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="5" class="text-center">No data available</td>
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