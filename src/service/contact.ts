// 联系人接口
import { ApiRequest } from "../units/api";

const contact = {
    // 获取联系人列表
    getContactList: (token: string) => {
        return ApiRequest("post", "contact/list", {token: token})
    },
    // 添加联系人
    addContact: (token: string, contact: string, name: string|undefined) => {
        return ApiRequest("post", "contact/add", 
        {
            token: token, 
            email: contact,
            name: (name === undefined || name === '' ? undefined : name)
        })
    },
    // 删除联系人
    deleteContact: (token: string, tid: number) => {
        return ApiRequest("post", "contact/delete", {token: token, tid: tid})
    }

}

export default contact;