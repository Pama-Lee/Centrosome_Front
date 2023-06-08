import { ApiRequest } from "../units/api";
const poll = {
    // 获取投票信息
    getPollInfo: (token: string, pid: number) => {
        return ApiRequest('post',"poll/getPollInfo", {token, pid});
    },
    // 添加参与者
    addPollUser: (token: string, pid: number, email: string) => {
        return ApiRequest('post',"poll/addPollUser", {token, pid, email});
    },
    // 删除参与者
    deletePollUser: (token: string, pid: number, email: string) => {
        return ApiRequest('post',"poll/deletePollUser", {token, pid, email});
    },
    // 通过邮件邀请参与者
    invitePollUser: (token: string, pid: number, email: string) => {
        return ApiRequest('post',"poll/invitePollUser", {token, pid, email});
    },
    // 获取投票数据
    getPollData: (token: string, pid: number) => {
        return ApiRequest('post',"poll/getPollData", {token, pid});
    },
    // 游客获取投票信息
    getPollInfoByQuest: (pid: number) => {
        return ApiRequest('post',"poll/getPollInfoByQuest", {pid});
    },
    // 进行投票
    participate: (token: string, pid: number, options: any) => {
        return ApiRequest('post',"poll/participate", {token, pid, options});
    },
    // 手动停止投票
    stopPoll: (token: string, pid: number) => {
        return ApiRequest('post',"poll/stopPoll", {token, pid});
    }
};

export default poll;