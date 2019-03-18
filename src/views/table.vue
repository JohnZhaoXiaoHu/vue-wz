<template>
    <div class="animated fadeIn">
        <br>
        <h3 align="center">社区低保评审会议直播</h3>
        <!--<br><br>-->
        <!--<Table align="center" :columns="columns" :data="data1">-->
        <!--</Table>-->
        <br><br>
        <div v-if="model1" style="width: 100%;text-align: center;font-size: 13px">暂无数据...</div>
        <div class="father">
            <div v-for="item in data1" @click="joinMeeting(item.Id)">
                <div class="divclass" >
                    <p style="padding: 5px 30px;font:bold 12px sans-serif;">{{item.Meetingname}} 
                        <span style="float: right;">{{item.Begintime}}</span>
                    </p>
                    <p style="padding: 5px 15px;font:normal 10px sans-serif;">[ {{item.Meetingstate}} ]
                        {{item.Meetingcontent}}</p>
                    <p style="padding: 5px 15px;font:normal 10px sans-serif;"></p>
                </div>
            </div>
        </div>
    </div>
    <!--<div  class="doc-header">-->
    <!--<Form ref="formDynamic" :model="formDynamic" :label-width="80">-->
    <!--<Form-item>-->
    <!--<Button type="solid" long @click="handleAdd()" icon="plus-round">//border: 1px solid red;-->
    <!--新增用户-->
    <!--</Button>-->
    <!--</Form-item>-->
    <!--</Form>-->

    <!--</div>-->
</template>

<script>
    import Cookies from 'js-cookie';
    import axios from "axios";
    import qs from "qs";

    export default {
        data() {
            return {
                data1: [],
                model1: false,
                columns: [
                    {
                        title: '会议编号',
                        key: 'Id'
                    },
                    {
                        title: '会议名称',
                        Meetingname: 'Meetingname'
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
                        width: 120,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
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
                                            this.joinMeeting(params.index);
                                        }
                                    }
                                }, '查看'),
                            ]);
                        }
                    }
                ],
            }
        },
        created() {
            this.getMeetingInfo();
        },
        methods: {
            joinMeeting(Id) {
                Cookies.set("meetId", Id);//
                axios.get("/proc/JoinMeeting", {
                    params: {
                        id: Id
                    }
                }).then(response => {
                    if(response.data.ErrCode==0){
                        this.$router.push({
                            path: '/liveBroadcast', query: {
                                index: Id
                            }
                        });
                    }else{
                        this.$Message.error(response.data.ErrMsg);
                    }
                }).catch(error => {
                    console.log("进入会议异常");
                    console.log(error);
                });

            },
            getMeetingInfo() {
                //获取当前信息
                //todo查询会议信息
                axios.get("/proc/GetMyMeetingInfo").then(response => {//pass double
                    //给data1赋值
                    const data0 = response.data;
                    if(response.data.ErrCode==-5){//未登录时清除cookies并回到登录页
                        Cookies.remove('Admin-Token');
                        Cookies.remove('UserName');
                        window.location.reload();
                    }
                    if (data0.ErrCode == 0) {

                        this.data1 = response.data.Result;
                        if (this.data1 != null) {
                            //设置显示状态
                            this.model1 = false;//暂无数据标签不显示
                            for (var i = 0; i < this.data1.length; i++) {
                                var begintime=this.data1[i].Begintime;
                                this.data1[i].Begintime = begintime.substring(5,16);
                                switch (this.data1[i].Meetingstate) {
                                    case 0 :
                                        this.data1[i].Meetingstate = "未开始";
                                        break;
                                    case 1 :
                                        this.data1[i].Meetingstate = "进行中";
                                        break;
                                    case 2 :
                                        this.data1[i].Meetingstate = "已结束";
                                        break;
                                }
                            }
                        } else {
                            this.model1 = true;//显示暂无数据
                        }
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log("可查看的会议获取异常");
                    console.log(error);
                });
            }
        }
    }
</script>

<style scoped>
    .father {
        width: 100%;
        height: 100%;
        border: 0px;
        border-bottom: 1px solid orange;
        background-color: white;
        list-style-type: none;
        border-radius:10px;
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