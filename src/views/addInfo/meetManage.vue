<template>

    <div>

        <Row>
            <Col span="24">

                <div style="" class="doc-header">
                    <br>
                    <h3 align="center">会议管理</h3>
                    <br><br>
                    <br><br>
                    <!--<Table align="center" :columns="columns" :data="data1">-->
                    <Table align="center" :columns="columns" :data="data1">
                    </Table>
                    <br><br>
                    <Modal v-model="model5" title="条件查询" @on-ok="meetSelOk" @on-cancel="meetSelCancel">
                        <Form :model="formSel" label-position="top">
                            <Form-item label="会议名称">
                                <Input style="width: 80%" v-model="formSel.input1" placeholder="输入会议名称"></Input>
                            </Form-item>
                            <Form-item label="会议状态">
                                <select v-model="formSel.input2">
                                    <option v-for="send  in meetStateList" name="sendSymbolId" :value="send.Id">
                                        {{send.stateName}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="社区名称">
                                <select v-model="formSel.input3">
                                    <option v-for="send  in communityList" name="sendSymbolId" :value="send.Id">
                                        {{send.Communityname}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="开始时间">
                                <Date-picker v-model="formSel.input4" type="datetime" placeholder="开始日期和时间"
                                             style="width: 200px"></Date-picker>
                            </Form-item>
                            <Form-item label="结束时间">
                                <Date-picker v-model="formSel.input5" type="datetime" placeholder="结束日期和时间"
                                             style="width: 200px"></Date-picker>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model2" title="修改会议" @on-ok="ok" @on-cancel="cancel">
                        <Form :model="formTop" label-position="top">
                            <Form-item label="社区名称">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formTop.input1">
                                    <option v-for="send  in communityList" name="sendSymbolId" :value="send.Id">
                                        {{send.Communityname}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="会议名称">
                                <Input v-model="formTop.input2"></Input>
                            </Form-item>
                            <Form-item label="会议内容">
                                <Input v-model="formTop.input3"></Input>
                            </Form-item>
                            <Form-item label="开始时间">
                                <Date-picker v-model="formTop.input4" type="datetime" placeholder="开始日期和时间"
                                             style="width: 200px"></Date-picker>
                            </Form-item>
                            <Form-item label="结束时间">
                                <Date-picker v-model="formTop.input5" type="datetime" placeholder="结束日期和时间"
                                             style="width: 200px"></Date-picker>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model3" title="新增会议" @on-ok="addOk" @on-cancel="addCancel">
                        <Form :model="formAdd" label-position="top">

                            <Form-item label="社区名称">
                                <select style="width: 100%;padding: 4px 3px; color:#495060;border:1px solid #dddee1;height: 32px;border-radius: 4px"
                                        v-model="formAdd.input1">
                                    <option v-for="send  in communityList" name="sendSymbolId" :value="send.Id">
                                        {{send.Communityname}}
                                    </option>
                                </select>
                            </Form-item>
                            <Form-item label="会议名称">
                                <Input v-model="formAdd.input2"></Input>
                            </Form-item>
                            <Form-item label="会议内容">
                                <Input v-model="formAdd.input3"></Input>
                            </Form-item>
                            <Form-item label="开始时间">
                                <Date-picker v-model="formAdd.input4" type="datetime" placeholder="开始日期和时间"
                                             style="width: 200px"></Date-picker>
                            </Form-item>
                            <Form-item label="结束时间">
                                <Date-picker v-model="formAdd.input5" type="datetime" placeholder="结束日期和时间"
                                             style="width: 200px"></Date-picker>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model4" title="删除提示" @on-ok="delOk" @on-cancel="delCancel">
                        <p>您将删除 [ {{meetingName}} ]<br>会议内容 [ {{meetingContent}} ]<br>是否确认删除?</p>
                    </Modal>

                </div>
                <div style="" class="doc-header">
                    <Form ref="formDynamic" :model="formDynamic" :label-width="80">


                        <Form-item>
                            <Button type="primary" long @click="meetSelects()">高级查询</Button>
                        </Form-item>
                        <Form-item>
                            <Button type="warning" long @click="handleAdd()"
                                    icon="plus-round">新增会议
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

    export default {
        data() {
            return {
                formInline: [{
                    user: ""
                }],
                model1: "",
                model2: false,
                model3: false,
                model4: false,
                model5: false,
                meetingId: 0,
                meetingName: "",
                meetingContent: "",
                formTop: {
                    input1: '',//社区名
                    input2: '',//会议名
                    input3: '',//会议内容
                    input4: '',//开始时间
                    input5: ''//结束时间
                },
                formSel: {
                    input1: '',//会议名
                    input2: -1,//会议状态
                    input3: 0,//所属社区
                    input4: '',//开始时间
                    input5: ''//结束时间
                },
                formAdd: {
                    input1: '',//社区名
                    input2: '',//会议名
                    input3: '',//会议内容
                    input4: '',//开始时间
                    input5: ''//结束时间
                },
                communityList: [],
                meetStateList: [
                    {
                        Id: -1,
                        stateName: "请选择"
                    },
                    {
                        Id: 0,
                        stateName: "未开始"
                    },
                    {
                        Id: 1,
                        stateName: "进行中"
                    },
                    {
                        Id: 2,
                        stateName: "已结束"
                    }
                ],
                columns: [
                    {
                        title: '会议编号',
                        key: 'Id'
                    },
                    {
                        title: '社区名称',
                        key: 'Communityid'
                    },
                    {
                        title: '会议名称',
                        key: 'Meetingname'
                    },
                    {
                        title: '会议内容',
                        key: 'Meetingcontent'
                    },

                    {
                        title: '开始时间',
                        key: 'Begintime'
                    },
                    {
                        title: '结束时间',
                        key: 'Endtime'
                    },
                    {
                        title: '会议状态',
                        key: 'Meetingstate'
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
                                            this.updateMeet(params.index)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.userManage(params.index)
                                        }
                                    }
                                }, '用户'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.modelDelete(params.index)
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
            this.initcommunity();//pass
            this.reloadPage();
        },
        methods: {
            updateMeet(index) {
                if (this.data1[index].Meetingstate == "未开始") {////大小写
                    this.model2 = true;
                    for (var i = 0; i < this.communityList.length; i++) {
                        if (this.communityList[i].Communityname == this.data1[index].Communityid) {
                            this.formTop.input1 = this.communityList[i].Id;//Communityname
                        }
                    }
                    this.formTop.input2 = this.data1[index].Meetingname;//M
                    this.formTop.input3 = this.data1[index].Meetingcontent;
                    this.formTop.input4 = this.data1[index].Begintime;
                    this.formTop.input5 = this.data1[index].Endtime;//////////
                    this.meetingId = this.data1[index].Id;
                } else {
                    this.$Message.error("[进行中] [已结束]的会议不可修改");
                }
            },
            meetSelects() {
                this.model5 = true;
                this.formSel.input4 = this.weekBefore();
                this.formSel.input5 = this.weekAfter();
            },

            userManage(index) {
                //todo enter the page of usermanage
                this.$router.push({
                    path: '/addInfo/userManage', query: {
                        index: this.data1[index].Id
                    }
                });
            },
            handleAdd() {//新建会议
                this.model3 = true;
                this.initcommunity();
            },
            initcommunity() {//初始化社区信息下拉框
                //todo add meeting and insert into DB
                //获取当前所有社区,初始化社区下拉框
                axios.get("/admin/GetCommunityList").then(response => {// pass double
                    if (response.data.ErrCode == -5) {//未登录时清除cookies并回到登录页
                        Cookies.remove('Admin-Token');
                        Cookies.remove('UserName');
                        window.location.reload();
                    }
                    this.communityList = response.data.Result;
                    var Id = this.$route.query.index;
                    //获取页面参数,如果从[社区管理]界面跳转过来,新增社区时默认选中当前社区
                    if (Id != undefined) {
                        this.formAdd.input1 = Id;
                        this.formSel.input3 = Id;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            ok() {//修改会议
                this.model2 = false;//设置关闭弹框
                //更新数据到数据库
                if (this.formTop.input1 != "") {//社区编号
                    if (this.formTop.input2 != "") {//会议名称
                        if (this.formTop.input3 != "") {//会议内容
                            if (this.formTop.input4 != "") {//开始时间
                                if (this.formTop.input5 != "") {//结束时间
                                    var bool = this.formTop.input4 < this.formTop.input5;
                                    if (bool) {
                                        axios.post("/admin/UpdateMeetingInfo", qs.stringify({//等待go修正   vue pass
                                            id: this.meetingId,
                                            meetingname: this.formTop.input2,
                                            meetingcontent: this.formTop.input3,
                                            communityid: this.formTop.input1,
                                            begintime: this.formatFunction(this.formTop.input4),
                                            endtime: this.formatFunction(this.formTop.input5)
                                        })).then(response => {
                                            const data0 = response.data;
                                            if (data0.ErrCode == 0) {
                                                this.$Message.success("修改成功");
                                                //修改后刷新界面
                                                this.reloadPage();
                                            }
                                        }).catch(error => {
                                            console.log("更新会议信息异常");
                                            console.log(error);
                                        });
                                    } else {
                                        this.$Message.error("结束时间不能晚于开始时间");
                                    }
                                } else {
                                    this.$Message.error("结束时间不能为空");
                                }
                            } else {
                                this.$Message.error("开始时间不能为空");
                            }
                        } else {
                            this.$Message.error("会议内容不能为空");
                        }
                    } else {
                        this.$Message.error("会议名称不能为空");
                    }
                } else {
                    this.$Message.error("社区名称不能为空");
                }
            },
            cancel() {
                console.log("click the [update] cancel key");
            },
            meetSelOk() {
                this.model5 = false;
                this.reloadPage();
            },
            meetSelCancel() {
                this.model5 = false;
            },
            addOk() {//新增会议界面  确定按键
                this.model3 = false;
                //todo get data from page
                if (this.formAdd.input1 != "") {//社区编号
                    if (this.formAdd.input2 != "") {//会议名称
                        if (this.formAdd.input3 != "") {//会议内容
                            if (this.formAdd.input4 != "") {//开始时间
                                if (this.formAdd.input5 != "") {//结束时间
                                    var bool = this.formAdd.input4 < this.formAdd.input5;
                                    if (bool) {
                                        //将数据插入到数据库
                                        axios.post("/admin/AddMeetingInfo", qs.stringify({//pass double
                                            meetingcontent: this.formAdd.input3,
                                            meetingname: this.formAdd.input2,
                                            communityid: this.formAdd.input1,
                                            begintime: this.formatFunction(this.formAdd.input4),
                                            endtime: this.formatFunction(this.formAdd.input5)
                                        })).then(response => {
                                            const data0 = response.data;
                                            if (data0.ErrCode == 0) {
                                                this.$Message.success("新增成功");
                                                this.reloadPage();//新增成功后刷新当前界面
                                                this.formAdd.input1 = "";
                                                this.formAdd.input2 = "";
                                                this.formAdd.input3 = "";
                                                this.formAdd.input4 = "";
                                                this.formAdd.input5 = "";
                                            } else {
                                                this.$Message.error(data0.ErrMsg);
                                            }
                                        }).catch(error => {
                                            console.log("新增会议异常");
                                            console.log(error);
                                        })
                                    } else {
                                        this.$Message.error("结束时间不能晚于开始时间");
                                    }
                                } else {
                                    this.$Message.error("结束时间不能为空");
                                }
                            } else {
                                this.$Message.error("开始时间不能为空");
                            }
                        } else {
                            this.$Message.error("会议内容不能为空");
                        }
                    } else {
                        this.$Message.error("会议名称不能为空");
                    }
                } else {
                    this.$Message.error("社区名称不能为空");
                }

            },
            addCancel() {
                this.formAdd.input1 = "";
                this.formAdd.input2 = "";
                this.formAdd.input3 = "";
                this.formAdd.input4 = "";
                this.formAdd.input5 = "";
                console.log("click the [add] cancel key");
            },
            modelDelete(index) {
                const Id = this.data1[index].Id;
                this.meetingId = Id;
                this.meetingName = this.data1[index].Meetingname;
                this.meetingContent = this.data1[index].Meetingcontent;
                this.model4 = true;
            },
            delOk() {
                this.handleRemove();
                this.model4 = false;
            },
            delCancel() {
                this.model4 = false;
            },
            handleRemove() {//删除会议
                // todo delete meeting from DB
                axios.post("/admin/DelMeetingInfo", qs.stringify({  //pass double
                    id: this.meetingId
                })).then(response => {
                    const data0 = response.data;
                    //todo
                    if (data0.ErrCode == 0) {
                        this.$Message.success("删除会议成功");
                        this.reloadPage();//删除成功后刷新当前界面
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log("删除会议异常");
                    console.log(error);
                });
            },
            reloadPage() {//加载界面
                //todo select meeting info
                axios.get("/admin/GetMeetingList", {//pass double
                    params: {
                        meetingname: this.formSel.input1,
                        meetingstate: this.formSel.input2 == undefined ? -1 : this.formSel.input2,
                        communityid: this.formSel.input3 == undefined ? 0 : this.formSel.input3,
                        begintime: this.formSel.input4 == "" ? "" : this.formatFunction(this.formSel.input4),
                        endtime: this.formSel.input5 == "" ? "" : this.formatFunction(this.formSel.input5)
                    }
                }).then(response => {
                    //todo initValue
                    this.data1 = response.data.Result;
                    if (response.data.ErrCode == -5) {//未登录时清除cookies并回到登录页
                        Cookies.remove('Admin-Token');
                        Cookies.remove('UserName');
                        window.location.reload();
                    }
                    this.formSel.input1 = "";
                    this.formSel.input2 = -1;
                    this.formSel.input3 = 0;
                    this.formSel.input4 = "";
                    this.formSel.input5 = "";
                    for (var i = 0; i < response.data.Result.length; i++) {
                        //转换为社区
                        var cid = this.data1[i].Communityid;//取到社区编号Communityid
                        for (var j = 0; j < this.communityList.length; j++) {
                            if (this.communityList[j].Id == cid) {//社区编号==社区列表中的id
                                this.data1[i].Communityid = this.communityList[j].Communityname;//对社区名赋值Communityid
                            }
                        }
                        //转换为会议状态
                        switch (this.data1[i].Meetingstate) {//Meetingstate
                            case 0:
                                this.data1[i].Meetingstate = "未开始";
                                break;//Meetingstate
                            case 1:
                                this.data1[i].Meetingstate = "进行中";
                                break;//Meetingstate
                            case 2:
                                this.data1[i].Meetingstate = "已结束";
                                break;//Meetingstate
                        }
                    }

                }).catch(error => {
                    console.log(error);
                });
            },
            formatFunction(time1) {//处理日期格式问题
                if (typeof (time1) != "string") {
                    var dateee = time1.toJSON();
                    var date1 = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                    return date1;
                } else {
                    return time1;
                }
            },
            weekBefore() {
                var now = new Date();
                var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                console.log("weekBefore===\n" + time);
                return time;
            },
            weekAfter() {
                var now = new Date();
                var date = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
                console.log("weekAfter===\n" + time);
                return time;
            }
        },

    }
</script>

<style>

    select {
        height: 32px;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        transition: border .2s ease-in-out, background .2s ease-in-out, box-shadow .2s ease-in-out, -webkit-box-shadow .2s ease-in-out;
        width: 80%;
    }
</style>

