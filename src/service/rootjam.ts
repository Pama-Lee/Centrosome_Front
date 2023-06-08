// 与rootjam相关的服务
import { ApiRequest } from "../units/api";


const rootjam = {
    // 验证token
    verfiyToken: (token: string) => {
        return ApiRequest("post", "login/token", {token: token})
    }
}

export default rootjam;