<template>
    <van-pull-refresh v-model="refresh" @refresh="onRefresh">
    <div class="mdui-container" v-if="!loading">
        <h1>{{ result.title }}</h1>
        <!-- 邀请的人列表 -->
        <div class="invite">
            <div class="mdui-row" style="padding-bottom: 30px;">
                <div class="mdui-col-xs-6">
                    <van-button type="primary" @click="openContact" block>Invite Contact</van-button>
                </div>
                <div class="mdui-col-xs-6">
                    <van-button type="primary" @click="inviteByEmail" block>Invite by email</van-button>
                </div>
                <div class="mdui-col-xs-12">
                    <van-button type="primary" @click="showShareBox" block style="margin-top: 10px;">Share</van-button>
                </div>
                <div class="mdui-col-xs-12">
                    <van-button type="danger" @click="stopPoll" block style="margin-top: 10px;">Stop Poll</van-button>
                </div>
            </div>

            <van-list v-model:loading="loading" :finished="finished" finished-text="Nothing More" @load="loadList">
                <van-swipe-cell v-for="item in users" :key="item">
                    <van-cell :title="item.email" />
                    <template #right>
                        <van-button square text="Delete" type="danger" class="delete-button" @click="deleteUser(item)" />
                    </template>
                </van-swipe-cell>

            </van-list>
        </div>
    </div>
    <van-popup v-model:show="addContact" round position="bottom" :style="{ height: '50%' }">
        <van-button type="primary" block @click="confirmAddContact">Confirm</van-button>
        <van-checkbox-group v-model="contacts">
            <van-cell-group inset>
                <van-cell v-for="(item, index) in list" clickable :key="item.name" :title="`${item.name}`"
                    @click="toggle(index)">
                    <template #right-icon>
                        <van-checkbox :name="item" :ref="el => contactsCheckBox[index] = el" @click.stop />
                    </template>
                </van-cell>
            </van-cell-group>
        </van-checkbox-group>
    </van-popup>
    <van-share-sheet v-model:show="showShare" title="Share To Friends" :options="options" @select="onSelect"
        cancel-text="Cancel" />
    <van-overlay :show="showQrcode" @click="showQrcode = false">
        <div class="wrapper" @click.stop style=" position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);">
            <qrcode-vue :value="link" level="H" :size=300 />
        </div>
    </van-overlay>
    <van-dialog v-model:show="showInvite" title="Inivte" confirm-button-text="Add" cancel-button-text="Cancel"
      show-cancel-button
      :on-confirm="sendInvite"
      >
      <van-field required v-model="emailInput" type="email" label="Email" placeholder="Please type in contact email" />
    </van-dialog>
</van-pull-refresh>
</template>





<script setup lang="ts">
// Poll的详情页, 可以邀请人参与投票
import { ref } from "vue";

import { useRoute } from "vue-router";
import { useCookies } from "vue3-cookies";
import { showDialog, showToast } from "vant";
import contact from "../../service/contact";
import poll from "../../service/poll";
import { showLoadingToast } from 'vant';
import QrcodeVue from 'qrcode.vue'
const token = useCookies().cookies.get("token");

const active = ref(0);
const showInvite = ref(false);
const emailInput = ref();

const refresh = ref(false);


const pid = ref();
const result = ref();
const users = ref();

const loading = ref(true);
const finished = ref(false);

const contactList = ref([]);

const addContact = ref(false);
const contacts = ref([]);
const contactsCheckBox: any = ref([]);
const addEmail = ref(false);

const list: any = ref([]);


const showQrcode = ref(false);

const link = ref('');

const showShare = ref(false);
const options = [
    { name: 'Copy Link', icon: 'link' },
    { name: 'Qrcode', icon: 'qrcode' },
];

const onSelect = (option: any) => {
    const host = window.location.host;
    showToast(option.name);
    if (option.name === 'Copy Link') {
        navigator.clipboard.writeText(`https://${host}/pollParticipate?p=${pid.value}`);
    }
    if (option.name === 'Qrcode') {
        //链接到 /pollParticipate?pid=
        // 获取域名
        link.value = `https://${host}/pollParticipate?p=${pid.value}`;
        // 生成二维码
        showQrcode.value = true;
    }
    showShare.value = false;
};

const showShareBox = () => {
    showShare.value = true;
};

const onRefresh = () => {
    getPollInfo();
};

const stopPoll = () => {

    // 确认框
    showDialog({
        title: "Notice",
        message: "Are you sure to stop this poll?",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Confirm",
    }).then(() => {
        // 确认停止
        poll.stopPoll(token, pid.value).then((res) => {
            if (res.data.code === 200) {
                showDialog({
                    title: "Notice",
                    message: "Stop successfully",
                }).then(() => {
                    // 上一页
                    window.history.go(-1);
                });
            } else {
                showDialog({
                    title: "Notice",
                    message: "Failed to stop",
                });
            }
        });
    }).catch(() => {
        // 取消停止
    });  
};

// 打开联系人列表
const openContact = () => {
    // 获取联系人列表
    contact.getContactList(token).then((res) => {
        if (res.data.code === 200) {
            const data = res.data.data;
            // 剔除已经邀请的联系人
            for (let i = 0; i < data.length; i++) {
                let flag = true;
                for (let j = 0; j < users.value.length; j++) {
                    if (data[i].name === users.value[j].email) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    list.value.push(data[i]);
                }
            }
        } else {
            showDialog({
                title: "Notice",
                message: "Failed to get contact list",
            });
        }
    });
    addContact.value = true;
};

// 通过电子邮件邀请
const inviteByEmail = () => {
    showInvite.value = true;
};

const sendInvite = () => {
    // 发送邀请
    poll.invitePollUser(token, pid.value, emailInput.value).then((res) => {
        if (res.data.code === 200) {
            showDialog({
                title: "Notice",
                message: "Invitation sent successfully",
            });
            getPollInfo();
        } else {
            showDialog({
                title: "Notice",
                message: "Failed to send invitation",
            });
        }
    });
    showInvite.value = false;

};

// 加载框
const loadingToast = showLoadingToast({
    message: 'Loading...',
    forbidClick: true,
});

// 选择联系人
const toggle = (index: any) => {
    contactsCheckBox.value[index].toggle();
};

// 获取poll的信息
const getPollInfo = async () => {
    // 获取poll的信息
    const res = await poll.getPollInfo(token, pid.value);
    if (res.data.code === 200) {
        result.value = res.data.data.poll;
        users.value = res.data.data.users;
        console.log(users.value);
        loading.value = false;
        finished.value = true;
        loadingToast.close();
        refresh.value = false;
    } else {
        loadingToast.close();
        showDialog({
            title: "Notice",
            message: "Invitation link is invalid",
        }).then(() => {
            // 上一页
            window.history.go(-1);
        });
    }
};

// 加载list
const loadList = async () => {
    // 检查list是否加载完毕
    if (finished.value) {
        return;
    }
};

// 确认添加联系人
const confirmAddContact = () => {
    // 确认添加联系人
    addContact.value = false;
    // 转换为字符串
    const res = arrayToString(contacts.value);
    console.log("ce", contacts.value);
    // 发送请求
    poll.addPollUser(token, pid.value, res).then((res) => {
        if (res.data.code === 200) {
            showDialog({
                title: "Notice",
                message: "Invitation sent successfully",
            });
            getPollInfo();
        } else {
            showDialog({
                title: "Notice",
                message: "Failed to send invitation",
            });
        }
    });

};

// 删除用户
const deleteUser = (item: any) => {
    // 删除用户
    poll.deletePollUser(token, pid.value, item.email).then((res) => {
        if (res.data.code === 200) {
            showDialog({
                title: "Notice",
                message: "Delete successfully",
            });
            getPollInfo();
        } else {
            showDialog({
                title: "Notice",
                message: "Failed to delete",
            });
        }
    });
};

// 转换数组为字符串
const arrayToString = (arr: any[]) => {
    // 利用|分割
    let res = "";
    console.log("arr:", arr[0].name);
    for (let i = 0; i < arr.length; i++) {
        // 如果是最后一个
        if (i === arr.length - 1) {
            res += arr[i].name;
        } else {
            res += arr[i].name + "|";
        }
    }
    return res;
};


// 检查url是否带有get参数
if (!window.location.href.includes("p")) {
    showDialog({
        title: "Notice",
        message: "Invitation link is invalid",
    }).then(() => {
        // 上一页
        window.history.go(-1);
    });
} else {
    pid.value = window.location.href.split("p=")[1];
    getPollInfo();
}



</script>