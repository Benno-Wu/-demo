import { message, } from "antd";

// 尝试回调的方式抽离方法，而不是打包成一个组件
export default function BlackCheck(host, guest, callback) {
    let params = {
        blacker: host,
        blacked: guest
    }
    console.log(`try fetch: blackCheck/`);
    fetch(`http://localhost:8080/P5/blackCheck`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    })
        .then(response => { return response.json(); })
        .then((responseJSON) => {
            console.log(responseJSON);
            if (responseJSON.message == 'allowed') {
                console.log('inside');
                message.info(responseJSON.message);
                callback(true);
            } else message.error(responseJSON.message);
        })
        .catch(() => message.info('出错了！'));
}