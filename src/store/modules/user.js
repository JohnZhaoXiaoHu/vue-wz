import {loginByEmail, logout, getInfo} from 'api/login';
import Cookies from 'js-cookie';
import qs from "qs";
import axios from "axios"


const user = {
    state: {
        user: '',
        status: '',
        email: '',
        code: '',
        uid: undefined,
        auth_type: '',
        token: Cookies.get('Admin-Token'),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
        setting: {
            articlePlatform: []
        }
    },
    mutations: {
        SET_AUTH_TYPE: (state, type) => {
            state.auth_type = type;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_EMAIL: (state, email) => {
            state.email = email;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        LOGIN_SUCCESS: () => {
            console.log('login success')
        },
        LOGOUT_USER: state => {
            state.user = '';
        }
    },

    actions: {
        // 用户登录0001
        LoginByEmail({commit}, userInfo) {
            const Uname = userInfo.email.trim();
            return new Promise((resolve, reject) => {
                axios.post("/proc/Login", qs.stringify({//pass
                    loginname: Uname,
                    loginpwd: userInfo.password
                })).then(response => {
                    const data0 = response.data;
                    if (data0.ErrCode == 0) {
                        var Login_Token = "editor";//默认普通用户
                        if(data0.Result.Usertype==0){//用户类型 1普通用户; 0管理员
                            Login_Token = "admin";
                        }
                        //查询成功存储Cookie&Token
                        Cookies.set('Admin-Token', Login_Token);
                        Cookies.set('UserName', Uname);
                        Cookies.set('userid', data0.Result.Id);
                        commit('SET_TOKEN', Login_Token);
                        resolve();
                    } else  {
                        reject(data0.ErrMsg);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },


        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data;
                    commit('SET_ROLES', data.role);//Array
                    commit('SET_NAME', data.name);//string
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_UID', data.uid);//int
                    commit('SET_INTRODUCTION', data.introduction);//string
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 第三方验证登录
        LoginByThirdparty({commit, state}, code) {
            return new Promise((resolve, reject) => {
                commit('SET_CODE', code);
                loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
                    commit('SET_TOKEN', response.data.token);
                    Cookies.set('Admin-Token', response.data.token);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },


        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    Cookies.remove('Admin-Token');
                    Cookies.remove('UserName');
                    window.location.reload();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Admin-Token');
                alert("has logout");
                resolve();
            });
        },

        // 动态修改权限
        ChangeRole({commit}, role) {
            return new Promise(resolve => {
                commit('SET_ROLES', [role]);
                commit('SET_TOKEN', role);
                Cookies.set('Admin-Token', role);
                resolve();
            })
        }
    }
};

export default user;
