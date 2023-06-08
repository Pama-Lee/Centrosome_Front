<template>
    <van-pull-refresh v-model="refresh" @refresh="onRefresh">
    <div>
        <div class="mdui-card" style="padding: 10px;">
            <div class="mdui-card-content">
            </div>
            <h3>Result</h3>
            <div class="mdui-table-fluid">
                <table class="mdui-table mdui-table-hoverable">
                    <thead>
                        <tr>
                            <th>Weekday</th>
                            <th>Time</th>
                            <th>Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in timeList">
                            <td>{{ getWeek([item.year, item.month, item.day]) }}</td>
                            <td>{{ renderTimeList(item) }}</td>
                            <td>{{ voteList[item.tid] || 0 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>User Data</h3>
            <div class="mdui-table-fluid">
                <table class="mdui-table mdui-table-hoverable">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Vote</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in userList">
                            <td>{{ item.email }}</td>
                            <td>{{ getUserOption(item) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </van-pull-refresh>
</template>

<script setup lang="ts">
// 这个页面用于展示投票的数据
import { ref, onMounted } from "vue";
import poll from "../../service/poll";
import { useCookies } from "vue3-cookies";


const pid: any = window.location.href.split("p=")[1];

const token = useCookies().cookies.get("token");

const timeList: any = ref([]);

const voteList: any = ref([]);

const userList: any = ref([]);

const refresh = ref(false);

const onRefresh = () => {
    poll.getPollData(token, pid).then((res) => {
        if (res.status === 200) {
            timeList.value = res.data.data.pollTimeList;
            voteList.value = res.data.data.countMap;
            userList.value = res.data.data.userOptions;
        }
        refresh.value = false;
    });
}


poll.getPollData(token, pid).then((res) => {
    if (res.status === 200) {
        timeList.value = res.data.data.pollTimeList;
        voteList.value = res.data.data.countMap;
        userList.value = res.data.data.userOptions;
    }
});

const renderTimeList = (item: any) => {
    return item.year + "-" + item.month + "-" + item.day + " " + item.start_time_hour + ":" + item.start_time_minute + "-" + item.end_time_hour + ":" + item.end_time_minute;
}

const getUserOption = (items: any) => {
    const options: any[] = [];
    if (items.options === undefined) {
        return "No vote";
    }
    for (let i = 0; i < items.options.length; i++) {
        // 寻找timeList中的tid相同的
        const item = timeList.value.find((item: any) => item.tid === items.options[i]);
        options.push(renderTimeList(item));
    }
    if (options.length === 0) {
        return "No vote";
    }
    // 转换成字符串, 用换行符分割
    return options.join("\n");
}

// 通过日期获取星期几
// 获取星期几
function getWeek(date: [number, number, number]) {
    const weekMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const year = date[0];
    const month = date[1];
    const day = date[2];
    // 根据日期获取星期几
    const week = new Date(year, month - 1, day).getDay();
    return weekMap[week];
}

</script>