<template>

    <div>

        <Row>
            <Col span="24">

                <div style="" class="doc-header">
                    <br>
                    <h3 align="center">用户管理</h3>
                    <br><br>
                    <!--<Table align="center" :columns="columns" :data="data1">-->
                    <Table align="center" :columns="columns" :data="data1">
                    </Table>
                    <br><br>

                    <Modal v-model="model4" title="高级查询" @on-ok="selOk" @on-cancel="selCancel">
                        <Form :model="formSel" label-position="top">
                            <Form-item label="登录名">
                                <Input v-model="formSel.input1"></Input>
                            </Form-item>
                            <Form-item label="社区名称">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formSel.input2">
                                    <option v-for="send  in communityList" name="sendSymbolId" :value="send.Id">
                                        {{send.Communityname}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="用户类型">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formSel.input3">
                                    <option v-for="user in userType" name="userType" :value="user.Id">
                                        {{user.typeName}}
                                    </option>
                                </select>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model2" title="修改用户信息" @on-ok="ok" @on-cancel="cancel">
                        <Form :model="formTop" label-position="top">

                            <Form-item label="社区名称">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formTop.input1">
                                    <option v-for="send  in communityList" name="sendSymbolId" :value="send.Id">
                                        {{send.Communityname}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="登录名">
                                <Input readonly v-model="formTop.input2"></Input>
                            </Form-item>
                            <Form-item label="设置新密码">
                                <Input type="password" v-model="formTop.input3"></Input>
                            </Form-item>
                            <Form-item label="真实姓名">
                                <Input v-model="formTop.input4"></Input>
                            </Form-item>
                            <Form-item label="手机号码">
                                <Input v-model="formTop.input5"></Input>
                            </Form-item>
                            <Form-item label="身份证号">
                                <Input v-model="formTop.input6"></Input>
                            </Form-item>
                            <Form-item label="用户类型">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formTop.input7">
                                    <option v-for="send  in userType" name="sendSymbolId" :value="send.Id">
                                        {{send.typeName}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="责任人名称">
                                <Input v-model="formTop.input8"></Input>
                            </Form-item>
                            <Form-item label="是否可登录直播系统">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formTop.input9">
                                    <option v-for="send  in Canloginstate" name="sendSymbolId" :value="send.Id">
                                        {{send.state}}
                                    </option>
                                </select>
                            </Form-item>

                        </Form>
                    </Modal>
                    <Modal v-model="model3" title="新增用户" @on-ok="addOk" @on-cancel="addCancel">
                        <Form :model="formAdd" label-position="top">
                            <Form-item label="社区名称">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formAdd.input1">
                                    <option v-for="send  in communityList" name="sendSymbolId" :value="send.Id">
                                        {{send.Communityname}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="手机号码">
                                <Input v-model="formAdd.input2"></Input>
                            </Form-item>
                            <Form-item label="密码">
                                <Input type="password" v-model="formAdd.input3"></Input>
                            </Form-item>
                            <Form-item label="确认密码">
                                <Input type="password" v-model="formAdd.input0"></Input>
                            </Form-item>
                            <Form-item label="用户类型">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formAdd.input4">
                                    <option v-for="send  in userType" name="userType" :value="send.Id">
                                        {{send.typeName}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="真实姓名">
                                <Input v-model="formAdd.input5"></Input>
                            </Form-item>
                            <Form-item label="身份证号码">
                                <Input v-model="formAdd.input6"></Input>
                            </Form-item>
                            <Form-item label="责任人名称">
                                <Input v-model="formAdd.input7"></Input>
                            </Form-item>
                            <Form-item label="是否可登录直播系统">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formAdd.input8">
                                    <option v-for="send  in Canloginstate" name="canLogin" :value="send.Id">
                                        {{send.state}}
                                    </option>
                                </select>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model5" title="删除提示" @on-ok="delOk" @on-cancel="delCancel">
                        <p>您将删除 [ {{userLoginName}} ]<br>用户姓名 [ {{userRealName}} ]<br>身份证号 [ {{userCardId}} ]<br>是否确认删除?
                        </p>
                    </Modal>
                </div>
                <div  class="doc-header">
                    <Form ref="formDynamic" :model="formDynamic" :label-width="80" >
                        <Form-item  style="margin-left: 0px">
                            <Button type="primary" long @click="selectUser()">高级查询</Button>
                        </Form-item>
                        <Form-item>
                            <Button type="solid" style="color:#fff; background-color: orange;border:1px solid orange"
                                    long @click="handleAdd()" icon="plus-round">新增用户
                            </Button>
                        </Form-item>
                    </Form>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import axios from "axios";
    import qs from "qs";
    import Cookies from "js-cookie";

    export default {
        data() {
            return {
                userLoginName: "",
                userRealName: "",
                userCardId: "",
                userId: "",
                model1: "",
                model2: false,
                model3: false,
                model4: false,
                model5: false,
                formSel: {
                    input1: '',//登录名
                    input2: -1,//社区     此处定义初始值,后期应该与go后台确定初始值是多少,自己定义为-1
                    input3: -1//用户类型  初始值同上,需要与后台确定
                },
                formTop: {
                    input1: '',//社区编号
                    input2: '',//登录名
                    input3: '',//密码
                    input4: '',//真实姓名
                    input5: '',//手机号码
                    input6: '',//身份证号
                    input7: '',//用户类型
                    input8: '',//责任人名称
                    input9: '',//是否可登录直播系统
                    input0: ''//用户编号
                },
                formAdd: {
                    input0: '',//确认密码
                    input1: '',//社区
                    input2: '',//手机号
                    input3: '',//密码
                    input4: '',//用户类型
                    input5: '',//真是姓名
                    input6: '',//身份证号
                    input7: '',//责任人
                    input8: ''//是否可登录直播

                },
                communityList: [],
                Canloginstate: [
                    {
                        Id: 0,
                        state: "是"
                    }, {
                        Id: 1,
                        state: "否"
                    }],
                userType: [
                    {
                        Id: 0,
                        typeName: "管理员"
                    }, {
                        Id: 1,
                        typeName: "普通用户"
                    }],
                columns: [
                    {
                        title: '用户编号',
                        key: 'Id'
                    },
                    {
                        title: '登录名',
                        key: 'Loginname'
                    },
                    {
                        title: '用户类型',
                        key: 'Usertype'
                    },
                    {
                        title: '真实姓名',
                        key: 'Realname'
                    },
                    {
                        title: '手机号码',
                        key: 'Mobileno'
                    },
                    {
                        title: '身份证号码',
                        key: 'Cardid'
                    },
                    {
                        title: '所属社区',
                        key: 'Communityid'
                    },
                    {
                        title: '注册时间',
                        key: 'Registertime'
                    },
                    {
                        title: '最新登陆时间',
                        key: 'Lastlogintime'
                    },
                    {
                        title: '责任人名称',
                        key: 'Personliablename'
                    },
                    {
                        title: '是否可登录直播',
                        key: 'Canloginstate'
                    },

                    {
                        title: '操作',
                        key: 'action',
                        width: 170,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateUser(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delUser(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data1: [],
                formDynamic: {
                    items: [
                        {
                            value: 'xin'
                        }
                    ]
                },
            }
        },//data
        created() {
            this.initCommunityList();
            this.reloadPage();
        },
        methods: {
            selectUser() {//查询用户
                this.model4 = true;
            },
            updateUser(index) {//修改用户信息时,对界面值初始化
                this.model2 = true;
                for (var j = 0; j < this.communityList.length; j++) {
                    if (this.data1[index].Communityid == this.communityList[j].Communityname) {
                        this.formTop.input1 = this.communityList[j].Id;
                    }
                }
                this.formTop.input0 = this.data1[index].Id;
                this.formTop.input2 = this.data1[index].Loginname;
                this.formTop.input4 = this.data1[index].Realname;
                this.formTop.input5 = this.data1[index].Mobileno;
                this.formTop.input6 = this.data1[index].Cardid;
                for (var j = 0; j < this.userType.length; j++) {
                    if (this.data1[index].Usertype == this.userType[j].typeName) {
                        this.formTop.input7 = this.userType[j].Id;
                    }
                }
                this.formTop.input8 = this.data1[index].Personliablename;
                for (var j = 0; j < this.Canloginstate.length; j++) {
                    if (this.data1[index].Canloginstate == this.Canloginstate[j].state) {
                        this.formTop.input9 = this.Canloginstate[j].Id;
                    }
                }
            },
            initCommunityList() {
                axios.get("/admin/GetCommunityList").then(response => {
                    // debugger
                    if(response.data.ErrCode==-5){//未登录时清除cookies并回到登录页
                        Cookies.remove('Admin-Token');
                        Cookies.remove('UserName');
                        window.location.reload();
                    }
                    if(response.data.ErrCode==0){
                        this.communityList = response.data.Result;
                    }else{
                        this.$Message.error(response.data.ErrMsg);
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            handleAdd() {//新建用户
                this.model3 = true;
                //todo add meeting and insert into DB
                //获取当前所有社区,初始化社区下拉框
            },
            selOk() {
                this.model4 = false;
                this.reloadPage();
            },
            selCancel() {
            },
            ok() {
                this.model2 = false;//设置关闭弹框
                //更新数据到数据库
                if (this.formTop.input8 != "") {
                    axios.post("/admin/UpdateUserInfo", qs.stringify({//vue pass  go debugging
                        id:this.formTop.input0,
                        loginname: this.formTop.input2,
                        loginpwd: this.formTop.input3,
                        usertype: this.formTop.input7,
                        realname: this.formTop.input4,
                        mobileno: this.formTop.input5,
                        cardid: this.formTop.input6,
                        communityid: this.formTop.input1,
                        personliablename: this.formTop.input8,
                        canloginstate: this.formTop.input9,
                    })).then(response => {
                        const data0 = response.data;
                        if (data0.ErrCode == 0) {
                            this.$Message.success("修改成功");
                            //修改后刷新界面
                            this.reloadPage();
                        } else {
                            this.$Message.error(data0.ErrMsg);
                        }
                    }).catch(error => {
                        console.log("更新会议信息异常");
                        console.log(error);
                    });
                } else {
                    this.$Message.error("密码不能为空");
                }
            },
            cancel() {
                console.log("click the [update] cancel key");
            },
            addOk() {//新增会议界面  确定按键
                this.model3 = false;
                //todo get data from page
                if (this.formAdd.input1 != "") {//社区编号
                    if (this.formAdd.input2 != "") {//手机号
                        if (this.formAdd.input3 != "") {//密码
                            if (this.formAdd.input4 == 0 || this.formAdd.input4 == 1) {//用户类型
                                if (this.formAdd.input5 != "") {//真实姓名
                                    if (this.formAdd.input6 != "") {//身份证号
                                        if (this.formAdd.input7 != "") {//责任人
                                            if (this.formAdd.input8 == 0 || this.formAdd.input8 == 1) {//是否可登录直播
                                                if (this.formAdd.input0 == this.formAdd.input3) {//验证两次密码一致
                                                    //将数据插入到数据库
                                                    axios.post("/admin/AddUserInfo", qs.stringify({
                                                        loginname: this.formAdd.input2,
                                                        loginpwd: this.formAdd.input3,
                                                        usertype: this.formAdd.input4,
                                                        realname: this.formAdd.input5,
                                                        mobileno: this.formAdd.input2,
                                                        cardid: this.formAdd.input6,
                                                        communityid: this.formAdd.input1,
                                                        personliablename: this.formAdd.input7,
                                                        canloginstate: this.formAdd.input8
                                                    })).then(response => {
                                                        const data0 = response.data;
                                                        if (data0.ErrCode == 0) {
                                                            this.$Message.success("新增用户成功");
                                                            this.formAdd.input0 = "";//确认密码
                                                            this.formAdd.input1 = "";//社区
                                                            this.formAdd.input2 = "";//手机号
                                                            this.formAdd.input3 = "";//密码
                                                            this.formAdd.input4 = "";//用户类型
                                                            this.formAdd.input5 = "";//真是姓名
                                                            this.formAdd.input6 = "";//身份证号
                                                            this.formAdd.input7 = "";//责任人
                                                            this.formAdd.input8 = "";//是否可登录直播
                                                            this.reloadPage();//新增成功后刷新当前界面
                                                        } else {
                                                            this.$Message.error(data0.ErrMsg);
                                                        }
                                                    }).catch(error => {
                                                        console.log("新增用户异常");
                                                        console.log(error);
                                                    })

                                                } else {
                                                    this.$Message.error("两次密码不一致");
                                                }
                                            } else {
                                                this.$Message.error("是否可登录直播项不能为空");
                                            }
                                        } else {
                                            this.$Message.error("责任人不能为空");
                                        }
                                    } else {
                                        this.$Message.error("身份证号不能为空");

                                    }
                                } else {
                                    this.$Message.error("真实姓名不能为空");
                                }
                            } else {
                                this.$Message.error("用户类型不能为空");
                            }
                        } else {
                            this.$Message.error("密码不能为空");
                        }
                    } else {
                        this.$Message.error("手机号不能为空");
                    }
                } else {
                    this.$Message.error("社区名称不能为空");
                }
            },
            addCancel() {
                this.formAdd.input2 = "";
                this.formAdd.input3 = "";
                this.formAdd.input4 = "";
                this.formAdd.input5 = "";
                console.log("click the [add] cancel key");
            },
            delUser(index) {
                this.model5 = true;
                this.userLoginName = this.data1[index].Loginname;
                this.userRealName = this.data1[index].Realname;
                this.userCardId = this.data1[index].Cardid;
                this.userId = this.data1[index].Id;
            },
            delOk() {
                this.model5 = false;
                this.handleRemove();
            },
            delCancel() {
                this.model5 = false;
                console.log("click the [delCancel] key to cancel");
            },
            handleRemove() {//删除用户
                // todo delete meeting from DB
                axios.post("/admin/DelUserInfo", qs.stringify({// vue pass    go   error
                    id: this.userId
                })).then(response => {
                    const data0 = response.data;
                    //todo
                    if (data0.ErrCode == 0) {
                        this.$Message.success("删除用户成功");
                        this.reloadPage();//删除成功后刷新当前界面
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log("删除用户异常");
                    console.log(error);
                });
            },
            reloadPage() {//加载界面
                //var communityId = this.$route.query.index;
                //todo select meeting info
                // console.log(typeof (this.formSel.input2));
                axios.get("/admin/GetUserList", {//pass double
                    params: {
                        loginname: this.formSel.input1,
                        communityid: this.formSel.input2 == undefined ? -1 : this.formSel.input2,
                        usertype: this.formSel.input3 == undefined ? -1 : this.formSel.input3
                    }
                }).then(response => {
                    //todo initValue
                    const data0 = response.data;

                    if (data0.ErrCode == 0) {
                        this.data1 = response.data.Result;
                        if (this.data1.length!=0) {
                            // debugger
                            for (var i = 0; i < this.data1.length; i++) {
                                for (var j = 0; j < this.userType.length; j++) {
                                    if (this.data1[i].Usertype == this.userType[j].Id) {
                                        this.data1[i].Usertype = this.userType[j].typeName;
                                    }
                                }
                                for (var j = 0; j < this.communityList.length; j++) {
                                    if (this.data1[i].Communityid == this.communityList[j].Id) {
                                        this.data1[i].Communityid = this.communityList[j].Communityname;
                                    }
                                }
                                for (var j = 0; j < this.Canloginstate.length; j++) {
                                    if (this.data1[i].Canloginstate == this.Canloginstate[j].Id) {
                                        this.data1[i].Canloginstate = this.Canloginstate[j].state;
                                    }
                                }
                            }
                        }
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                    this.formSel.input1 = "";
                    this.formSel.input2 = -1;
                    this.formSel.input3 = -1;
                }).catch(error => {
                    console.log(error);
                })
            },
            formatFunction(time1) {//处理日期格式问题
                var dateee = time1.toJSON();
                var date1 = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                console.log(date1);//string 类型
                console.log(typeof (date1));
                var date2 = new Date(date1.replace(/-/, "/"));
                console.log(date2);//中国标准时间
                console.log(typeof (date2));
                return date1;

            }
        },

    }
</script>



