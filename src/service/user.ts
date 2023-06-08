import { ApiRequest } from "../units/api";
const user = {
    // 获取用户信息
    getUserInfo: (token: string) => {
        return ApiRequest("post", "user/info", {token: token})
    }
};
export default user;