<template>
    <div class="mdui-container">
        <div class="mdui-typo-display-1 mdui-text-center" style="padding-top: 20px; padding-bottom: 20px;">{{ title || 'NULL' }}</div>

        <div class="mdui-card">
            <div class="mdui-row">
                <div class="mdui-col-xs-6" style="padding: 5px;">
                    <div class="mdui-card-primary-title mdui-text-center">{{
                        'Founder' }}
                    </div>
                    <div class="mdui-card-primary-subtitle mdui-text-center">{{ founder || 'NULL' }}</div>
                </div>
                <div class="mdui-col-xs-6" style="padding: 5px;">
                    <div class="mdui-card-primary-title mdui-text-center" >{{
                        'Location' }}
                    </div>
                    <div class="mdui-card-primary-subtitle mdui-text-center">{{ location || "NULL" }}</div>
                </div>
            </div>
        </div>
        <div class="mdui-divider" style="margin-top: 10px;"></div>
        <div class="mdui-list">
            <label class="mdui-list-item mdui-ripple" v-for="item in timeList">
                <div class="mdui-checkbox">
                    <input type="checkbox" name="select" :value="item.tid"/>
                    <i class="mdui-checkbox-icon"></i>
                </div>
                <div class="mdui-list-item-content">{{ renderTimeList(item) }}</div>
            </label>
        </div>
        <div class="mdui-divider" style="margin-top: 10px;"></div>
        <button class="mdui-btn mdui-btn-block mdui-color-pink-accent mdui-ripple" v-if="isAuth" @click="submit()">Submit</button>
        <button class="mdui-btn mdui-btn-block mdui-color-pink-accent mdui-ripple" v-if="!isAuth" @click="toLogin()">Sign in to participate</button>
        </div>
</template>

<script setup lang="ts">
import { showDialog } from 'vant';
import { onMounted, ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import poll from '../service/poll';


const founder = ref('');
const location = ref('');
const title = ref('');

const deadline = ref();

// 检查链接中是否有pid
const pid: any = window.location.href.split("p=")[1];
if (!pid) {
    window.location.href = "/";
}
const isAuth = ref(false);
// 检查是否有cookie
const { cookies } = useCookies();
if (cookies.get("token")) {
    isAuth.value = true;
} else {
    isAuth.value = false;
}

const toLogin = () => {
    window.location.href = "/login?redirect=/pollParticipate?p=" + pid;
}

const submit = async () => {
    // 检查是否存在token
    if (!cookies.get("token")) {
        showDialog({
            title: "Error",
            message: "Please sign in first",
        });
        return;
    }
    const selectValue = getSelectValue();
    if (selectValue.length === 0) {
        showDialog({
            title: "Error",
            message: "Please select at least one time",
        });
        return;
    }
    const token = cookies.get("token");
    // 转为字符串, 用,分割
    const selectValueString = selectValue.join(",");
    const res = await poll.participate(token,pid, selectValueString);
    if (res.data.code === 200) {
        showDialog({
            title: "Success",
            message: "Participate successfully",
        }).then(() => {
            window.location.href = "/";
        });
    } else {
        showDialog({
            title: "Error",
            message: res.data.message,
        });
    }
}

const timeList: any = ref([]);

onMounted(async () => {
    const res = await poll.getPollInfoByQuest(pid);
    if (res.status === 200) {
        console.log(res.data);
        founder.value = res.data.data.founder;
        location.value = res.data.data.location;
        timeList.value = res.data.data.time;
        title.value = res.data.data.title;
        deadline.value = res.data.data.deadline;
    } else {
        showDialog({
            title: "Error",
            message: res.data.msg,
        });
    }

    // 检查是否过期, deadline中包含年月日时分
    const deadlineDateArray = [deadline.value.year, deadline.value.month, deadline.value.day];
    const deadlineDate = new Date(deadlineDateArray[0], deadlineDateArray[1] - 1, deadlineDateArray[2], deadline.value.hour, deadline.value.minute);
    const nowDate = new Date();
    console.log(deadlineDate, nowDate);
    if (deadlineDate < nowDate) {
        showDialog({
            title: "Error",
            message: "This poll is expired",
        }).then(() => {
            window.location.href = "/";
        });
    }
});

const renderTimeList = (item: any) => {
    return item.year + "-" + item.month + "-" + item.day + " " + item.start_time_hour + ":" + item.start_time_minute + "-" + item.end_time_hour + ":" + item.end_time_minute;
}

// 获取select的值
function getSelectValue() {
    const select: any = document.getElementsByName("select");
    const selectValue = [];
    for (let i = 0; i < select.length; i++) {
        if (select[i].checked) {
            selectValue.push(select[i].value);
        }
    }
    return selectValue;
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