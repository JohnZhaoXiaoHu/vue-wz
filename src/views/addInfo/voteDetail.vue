<template>
    <div class="animated fadeIn">
        <h3 align="center">社区低保评审会议直播</h3>
        <Modal v-model="value0" title="评议详情" @on-ok="voteOk" @on-cancel="voteCancel">
            <h4 style="width: 100%; align-content: center">{{meetingNameTitle}}</h4><br>
            <div class="father">
                <div v-for="item in data2" v-if="table1">
                    <div class="divclass">
                        <p style="padding: 5px 0px;font:bold 12px sans-serif;">[ {{item.Loginname}} ] {{item.Realname}}
                            <span style="float: right;">{{item.Votetime}}</span>
                        </p>
                        <p style="padding: 5px 0px;font:normal 10px sans-serif;">[ {{meetingName}} ]
                            {{item.Experiencecontent}}</p>
                        <p style="padding: 5px 15px;font:normal 10px sans-serif;"></p>
                    </div>
                </div>
                <div v-if="table2">
                    <div class="divclass"><h6 style="width: 100%; align-content: center">暂无评论内容...</h6></div>
                </div>
            </div>
            <!--<Table border="1" align="center" :columns="voteDetail" :data="data2">-->
            <!--</Table>-->
        </Modal>
        <Row :gutter="16" style="margin-top:45px">
            <Col :xs="12" :sm="12" :md="12" :lg="24">
                <dash-chart-visitor :param="value1"></dash-chart-visitor>
            </Col>
        </Row>
        <br>
        <Table align="center" :columns="columns" :data="data1">
        </Table>
    </div>
</template>

<script>
    import DashChartVisitor from '../charts/DashChartVisitor';
    import axios from "axios";
    import Bus from '../Bus.js'

    export default {
        components: {DashChartVisitor},
        data() {
            return {
                table1: false,
                table2: true,
                meetingName:"",
                meetingNameTitle: "",
                data1: [],
                data2: [],
                details: [],
                switch1: false,
                value0: false,
                value1: false,
                value2: 0,
                value3: 0,
                communityList: [],
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
                                            this.voteDetailFunc(params.index);
                                        }
                                    }
                                }, '查看评议'),
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
                                            this.voteResult(params.index);
                                        }
                                    }
                                }, '查看票数')
                            ]);
                        }
                    }
                ],
                voteDetail: [
                    {
                        title: '用户编号',
                        width: 100,
                        key: 'Id'
                    },
                    {
                        title: '登录名',
                        key: 'Loginname'
                    },
                    {
                        title: '姓名',
                        key: 'Realname'
                    },
                    // {
                    //     title: '手机号',
                    //     key: 'Mobileno'
                    // },
                    {
                        title: '评议时间',
                        key: 'Votetime'
                    },
                    {
                        title: '评议内容',
                        key: 'Experiencecontent'
                    },
                ]
            }
        },
        created() {
            this.initcommunity();
            this.reloadPage();
        },
        methods: {
            voteDetailFunc(index) {
                this.value0 = true;
                //GetMeetingJoinByMeetingID
                axios.get("/admin/GetMeetingJoinByMeetingID", {
                    params: {
                        id: this.data1[index].Id
                    }
                }).then(response => {
                    if (response.data.ErrCode == 0) {
                        var data0 = response.data.Result;
                        if (data0.mjInfo != null && data0.mjInfo.length > 0) {
                            this.table1 = true;
                            this.table2 = false;
                            for (var i = 0; i < data0.mjInfo.length; i++) {
                                var para = {
                                    Id: data0.userInfo[i].Id,
                                    Loginname: data0.userInfo[i].Loginname,
                                    Realname: data0.userInfo[i].Realname,
                                    Mobileno: data0.userInfo[i].Mobileno,
                                    Votetime: data0.mjInfo[i].Votetime,
                                    Experiencecontent: data0.mjInfo[i].Experiencecontent
                                }
                                this.data2.push(para);
                            }
                        } else {
                            this.table1 = false;
                            this.table2 = true;
                        }
                        this.meetingName = this.data1[index].Meetingname;
                        this.meetingNameTitle = "[" + this.data1[index].Meetingname + "] 评议结果";
                    } else {
                        this.$Message.error(response.data.ErrMsg);
                    }
                }).catch(error => {
                    console.log("获取评议详情异常");
                    console.log(error);
                });

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
            voteResult(index) {
                // this.value0 = true;
                const meetingId = this.data1[index].Id;
                //非父子关系传参
                Bus.$emit('val', meetingId);
                //this.value1 = true;
            },
            voteOk() {
                this.value0 = false;
                this.data2 = [];
            },
            voteCancel() {
                this.value0 = false;
                this.data2 = [];
            },
            reloadPage() {//加载界面
                var communityId = this.$route.query.index;
                //todo select meeting info
                axios.get("/admin/GetMeetingList", {//测试一半   所需参数不确定   是否需要增加搜索功能
                    params: {
                        communityid: 0,
                        meetingstate: 2,
                        meetingname: "",
                        endtime: "",
                        begintime: ""
                    }
                }).then(response => {
                    if (response.data.ErrCode == -5) {//未登录是清楚cookies并回到登录页
                        Cookies.remove('Admin-Token');
                        Cookies.remove('UserName');
                        window.location.reload();
                    }
                    //todo initValue
                    this.data1 = response.data.Result;
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
                })
            },

        },
        mounted() {

        }
    }
</script>
<style type="text/css" scoped>
    .father {
        width: 100%;
        height: 100%;
        border: 0px;
        border: 1px solid orange;
        background-color: white;
        list-style-type: none;
        border-radius: 10px;
        padding: 10px;
    }

    .divclass {
        width: 100%;
        height: 100%;
        border: 0px;
        border-bottom: 1px dashed #dcdcdc;
        background-color: white;
        text-align: left;
    }
</style>