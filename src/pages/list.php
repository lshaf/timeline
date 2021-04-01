<template id="page-list">
    <div class="list">
        <div class="navigator">
            <button type="button" @click="openForm()">Add Project</button>
            <button type="button" @click="openSetting()">Setting</button>
            <input type="text" v-model.trim="search" placeholder="Search name">
            <button type="button" @click="renderPage(page-1)">Prev</button>
            <button type="button" @click="renderPage(page+1)">Next</button>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody v-if="timelines.length">
                <tr v-for="timeline in timelines" :key="timeline.id">
                    <td>{{ timeline.name }}</td>
                    <td class="text-center">
                        <button type="button" @click="openForm(timeline.id)">Audit</button>
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="2" class="text-center">No data available</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>