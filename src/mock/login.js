import {param2Obj} from 'utils';
import axios from "axios"

const userMap = {
    admin: {
        role: ['admin'],
        token: 'admin',
        introduction: '我是超级管理员',
        name: 'Super Admin',
        uid: '001'
    },
    editor: {
        role: ['editor'],
        token: 'editor',
        introduction: '我是编辑',
        name: 'Normal Editor',
        uid: '002'


    },
    developer: {
        role: ['develop'],
        token: 'develop',
        introduction: '我是开发',
        name: '工程师小王',
        uid: '003'
    }
}

export default {
    method:{
        post:function(){
            axios.post("/testLogin", JSON.parse(config.body)).then(data =>{
                alert(data.success);
            } ).cache(error =>{
                console.log("--------------error--------------");
                console.log(error);
            })
        }
    },
    loginByEmail: config => {
        const {email} = JSON.parse(config.body);
        return userMap[email.split('@')[0]];
    },
    getInfo: config => {
        const {token} = param2Obj(config.url);
        if (userMap[token]) {
            return userMap[token];
        } else {
            return Promise.reject('a');
        }
    },
    logout: () => 'success'
};
