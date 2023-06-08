import axios from 'axios';
/**
 * axios
 * @param：{string}     method          请求类型,必填
 * @param：{string}     url             请求地址,必填
 * @param：{string}     params          请求参数,非必填
 * @param：{string}     type            请求模式，针对get，params/data
 * @param：{string}     variation       请求头,非必填
 **/
export const ApiRequest = async (method:any, url:any, params = {}, type = "data", isToken = false) => {
    let headers = { 'Content-Type': 'application/json', }
    let url_pre:string = "";
    // 读取配置文件/config.json
    if (isToken) {
        // @ts-ignore
        headers['Authorization'] = 'token'
    }
    //axios获取config.json
    const config = await axios.get('/config.json');
    if (config.data.host) {
        url_pre = config.data.host;
    } else {
        url_pre = "http://localhost:12000/App/centro";
    }

    if (method == 'get' || type == "params") {
        return axios({
            method: method,
            url: url_pre+url,
            headers: headers,
            params: params
        });
    } else {
        return axios({
            method: method,
            url: url_pre+url,
            headers: headers,
            data: params
        });
    }

};