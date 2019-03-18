<template>

    <div class="animated fadeIn">
        <!-- 标题 -->
        <!--<Row>-->
        <!--<Col :sm="24" :md="8">-->
        <!--<h3>投票直播</h3>-->
        <!--</Col>-->
        <!--</Row>-->

        <!-- 考察记录图片 -->
        <!--<div>-->
        <!--<h3>-->
        <!--<strong>实际考察记录图片</strong>-->
        <!--</h3>-->

        <!--</div>-->
        <!-- 文字信息展示 -->
        <Row>
            <Col>
                <div id="flex-1" class="flex-1"
                     style="background: url(../../static/img/back.png) repeat-x 0px 0px;padding: 10px;">
                    <div class="item1" style="width: 60%;">
                        <table border="0" height="30" width="100%">
                            <tr>
                                <td align="right" width="90px"><strong>编号:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{familyInfo.intId}}</p></td>
                            </tr>
                            <tr>
                                <td align="right"><strong>用户名称:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{familyInfo.UserName}}</p></td>
                            </tr>
                            <!--<tr>-->
                            <!--<td></td>-->
                            <!--<td align="right"><strong>身份证号:</strong></td>-->
                            <!--<td align="left"><p>&nbsp;&nbsp;{{familyInfo.CardID}}</p></td>-->
                            <!--</tr>-->
                            <tr>
                                <td align="right"><strong>年龄:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{familyInfo.Age}}</p></td>
                            </tr>
                            <tr>
                                <td align="right"><strong>家庭人口:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{familyInfo.FamilyNum}}</p></td>
                            </tr>
                            <tr>
                                <td align="right"><strong>人均收入:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{familyInfo.PerIncome}}</p></td>
                            </tr>
                            <tr>
                                <td align="right"><strong>贫困种类:</strong></td>
                                <td align="left" width="170"><p>&nbsp;&nbsp;{{familyInfo.DiseaseType}}</p></td>
                            </tr>
                            <tr>
                                <td align="right"><strong>赞成票数:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{voteInfo.PassNumber}}</p></td>
                            </tr>
                            <tr>
                                <td align="right"><strong>会议结果:</strong></td>
                                <td align="left"><p>&nbsp;&nbsp;{{familyInfo.PassResult}}</p></td>
                            </tr>
                        </table>
                    </div>
                    <div class="item2" style="width: 40%;">
                        <div class="carousel-wrap" id="carousel" style="width: auto;background-color: transparent;">
                            <transition-group tag="ul" class='slide-ul' name="list">
                                <li style="margin: 0px;" v-for="(list,index) in slideList" :key="index"
                                    v-show="index===currentIndex"
                                    @mouseenter="stop"
                                    @mouseleave="go">
                                    <img class="myimg" :src="list">
                                </li>

                            </transition-group>
                        </div>

                    </div>


                </div>
                <div id="newInfoDiv">
                    <p style="background-color: #dcdcdc; margin: 0px;padding: 10px;">
                        <span style="font-weight: bold">消息通知 :</span>
                        <!--  -->
                        <span>{{loginType =="0"?"管理员":"用户"}} [ {{loginName}} ] 已上线 , </span>

                        <span>居民观看人数 : {{sumViewer}}</span>
                    </p>
                </div>
                <Modal v-model="modelValue" title="评议会议" @on-ok="voteOk" @on-cancel="voteCancel">
                    <h1>{{title_header}}</h1><br><br>
                    <Form :model="formItem" :label-width="80">
                        <!--<Form-item label="是否满意">-->
                        <!--<Radio-group v-model="formItem.radio">-->
                        <!--满意-->
                        <!--不满意</Radio>-->
                        <!--</Radio-group>-->
                        <!--</Form-item>-->

                        <Form-item>
                            <Radio-group v-model="formItem.radio" style="width: 100%;">
                                <Radio label='y' style="width: 70%;">
                                    <Button type="primary" @click="submitInfo(1)" long>满&ensp;&ensp;&ensp;意</Button>
                                </Radio>
                                <br> <br>
                                <Radio label='n' style="width: 70%;">
                                    <Button type="error" @click="submitInfo(2)" long>不&ensp;满&ensp;意</Button>
                                </Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="评议内容" id="textId" style="display: none;">
                            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                                   placeholder="请输入您对会议的评价..."></Input>
                        </Form-item>
                    </Form>
                </Modal>
            </Col>

        </Row>


        <!-- 评议按钮 -->
        <Row>
            <Col>
                <div style="height: 80px">
                    <br>
                    <Button v-show="goWrite" @click="gotoWrite()" type="primary" long>{{Msg}}</Button>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import DashChartCount from './charts/DashChartCount';
    import DashChartVisitor from './charts/DashChartVisitor';
    import DashChartLarge from './charts/DashChartLarge';
    import VueCalendar from './components/VueCalendar';
    import TodoList from '@/components/TodoList'
    import axios from "axios";
    import qs from "qs";
    import Cookies from "js-cookie";

    export default {
        components: {DashChartCount, DashChartVisitor, DashChartLarge, VueCalendar, TodoList},
        name: 'dashboard',
        data() {
            return {
                modelValue: false,
                formItem: {
                    radio: 'y',
                    textarea: '',
                    meetId: ""
                },
                title_header: "您对本次直播是否满意?",
                butMsg: "",
                Msg: "评议会议",
                flag: false,
                isShow: false,
                goWrite: false,
                tempIndex: 0,//临时测试数据
                //用户信息
                familyInfo: {
                    intId: "",//编号
                    UserName: "",//用户名称
                    CardID: "",//身份证号
                    Age: "",//年龄
                    FamilyNum: "",//家庭人口
                    SafeguardNum: "",//保障人口
                    PerIncome: "",//人均收入
                    DiseaseType: "",//疾病种类
                    PassResult: "",//会议结果
                },
                //票数信息
                voteInfo: {
                    PassNumber: "",//赞成票数
                    AllNumber: "",//总票数
                    DissentingVoteNumber: "",//反对票数
                    CancelNumber: "",//弃权票数
                    OverallNumber: "",//应参加评议人数
                },
                // 图片信息
                Images: [],
                value1: "0",
                value2: "0",
                value3: "0",
                value4: "0",
                percent1: 0,
                percent2: 0,
                percent3: 0,
                percent4: 0,
                speed: 10000,
                favour: 0,
                //原来的图片信息
                slideList: [],
                currentIndex: 0,
                timer: '',
                stopInterVal: 0,
                newUserLogin: [],//最新用户列表
                sumViewer: 0,//当前观看人数
                loginType: "",//用户类型
                loginName: "",//用户名称
                showFlag: "",//切换显示延时
                plusFlag: 0,//当前遍历的索引值

            }
        },
        created() {
            this.getParams();
            this.$nextTick(() => {
                this.timer = setInterval(() => {
                    this.autoPlay()
                }, 4000)
            })
        },
        methods: {
            gotoWrite() {
                //this.$router.push({path: '/Evaluate'});
                this.modelValue = true;
            },
            submitInfo(index) {
                if (index == 2) {
                    $("#textId").css("display", "block");
                    this.formItem.radio = "n";
                } else {
                    $("#textId").css("display", "none");
                    this.formItem.radio = "y";
                }
            },
            voteOk() {
                const Uname = Cookies.get("UserName");
                const Evaluated = Cookies.get("Evaluated");
                //todo 查询当前用户是否已评议
                if (Evaluated != (Uname + "_" + this.formItem.meetId)) {//未评议过此次会议
                    axios.post("/proc/VoteMeeting", qs.stringify(//未测试
                        {
                            id: this.formItem.meetId,
                            userid: Cookies.get("userid"),
                            userexperience: this.formItem.radio == "y" ? 1 : 2,
                            experiencecontent: this.formItem.textarea == "" ? "满意" : this.formItem.textarea
                        }
                    )).then(response => {
                        const data0 = response.data;
                        if (data0.ErrCode == -5) {//未登录时清除cookies并回到登录页
                            Cookies.remove('Admin-Token');
                            Cookies.remove('UserName');
                            window.location.reload();
                        }
                        if (data0.ErrCode == 0) {
                            this.$Message.success('评价成功');
                            this.formItem.radio = "y";
                            this.modelValue = false;
                            this.formItem.textarea = "";
                            this.goWrite = false;
                            //记录当前用户已评议，不可重复评议
                            //使用'会议编号'+'会议编号'以支持'同一用户评议不同会议'和'不同用户相同会议'
                            Cookies.set("Evaluated", Uname + "_" + this.formItem.meetId);
                            setTimeout(() => {
                                this.$router.push({path: '/'});
                            }, 1000)
                        } else {
                            this.$Message.error(data0.ErrMsg);
                        }
                    }).catch(error => {
                        console.log(error + "error网络异常");
                    });
                } else {
                    this.$Message.error('您已评议过此次会议,不可重复评议');
                }
            },
            voteCancel() {
                this.goWrite = true;
                this.modelValue = false;
            },
            //获取初始化文字和图片静态信息
            getParams() {
                if (window.orientation == 90 || window.orientation == -90) {
                    $("#flex-1").removeAttr("class");
                    $("#carousel").css("width", "100%");
                } else {
                    $("#flex-1").attr("class", "flex-1");
                    $("#carousel").css("width", "360px");
                }
                var meetingId = this.$route.query.index;
                this.formItem.meetId = meetingId;
                if (meetingId != null && meetingId != undefined && meetingId != "") {
                    this.getVotesDetail();
                    this.getNewInfo();
                } else {
                    this.$Message.error("请选择会议");
                    this.$router.push({path: '/'});
                }
                // 取到路由带过来的参数
            },
            getNewInfo() {
                var meetingId = this.$route.query.index;
                var vm = this;
                this.showFlag = setInterval(function () {
                    if (vm.plusFlag == vm.newUserLogin.length) {//索引遍历完最后一个之后,重新查询数据
                        axios.get("/Live/GetViewers", {
                            params:
                                {
                                    meetingid: meetingId
                                }
                        }).then(response => {
                            if (response.data.ErrCode == -5) {//未登录时清除cookies并回到登录页
                                Cookies.remove('Admin-Token');
                                Cookies.remove('UserName');
                                window.location.reload();
                            }
                            if (response.data.ErrCode == 0) {
                                const data00 = response.data.Result.userInfo;//获取整个会议信息对象
                                const len = vm.newUserLogin.length;
                                vm.newUserLogin = [];
                                vm.plusFlag = 0;
                                for (var i = vm.sumViewer; i < data00.length; i++) {
                                    vm.newUserLogin.push(data00[i]);
                                }
                                vm.sumViewer = data00.length;

                            }

                        }).catch(error => {

                        })
                    }
                    if (vm.newUserLogin.length != vm.plusFlag) {
                        vm.loginType = vm.newUserLogin[vm.plusFlag].Usertype;
                        vm.loginName = vm.newUserLogin[vm.plusFlag].Realname;
                        vm.plusFlag++;
                    }
                }, 3000);
                // clearInterval(this.showFlag)
            },

            //获取票数等动态信息
            getVotesDetail() {
                var meetingId = this.$route.query.index;
                this.goWrite = false;
                //渲染文字/图片数据
                this.stopInterVal = setInterval(() => {
                    axios.get("/proc/RefreshMeeting", {
                        params:
                            {
                                id: meetingId
                            }
                    }).then(response => {
                        if (response.data.ErrCode == -5) {//未登录时清除cookies并回到登录页
                            Cookies.remove('Admin-Token');
                            Cookies.remove('UserName');
                            window.location.reload();
                        }
                        if (response.data.ErrCode == 0) {
                            const data00 = response.data.Result;//获取整个会议信息对象
                            var data0 = JSON.parse(data00.Nowcontent);//将对象中的会议实时json串转为对象
                            //查询当前被投票人是否有变更,使用'身份证号'+'姓名'判断
                            //二者其一有变化即需要对静态信息重新赋值
                            //if (this.familyInfo.CardID != data0.CardID || this.familyInfo.UserName != data0.UserName) {
                            //this.getParams();//有变更时对个人信息重新赋值
                            this.familyInfo.intId = data0.intId;//编号
                            this.familyInfo.UserName = data0.UserName;//用户名称
                            this.familyInfo.CardID = data0.CardID;//身份证号
                            this.familyInfo.Age = data0.Age;//年龄
                            this.familyInfo.FamilyNum = data0.FamilyNum;//家庭人口
                            this.familyInfo.SafeguardNum = data0.SafeguardNum;//保障人口
                            this.familyInfo.PerIncome = data0.PerIncome;//人均收入
                            this.familyInfo.DiseaseType = data0.DiseaseType;//疾病种类
                            this.familyInfo.PassResult = data0.PassResult;//会议结果
                            this.slideList = data0.Images;
                            //初始化投票数据
                            this.value1 = data0.PassNumber * 1;//赞同票数
                            this.value2 = data0.DissentingVoteNumber * 1;//反对票数
                            this.value3 = data0.CancelNumber * 1;//弃权票数
                            this.value4 = (this.value1 + this.value2 + this.value3);//总票数
                            this.voteInfo.PassNumber = this.value1;//文本赞成票数
                            this.favour = data0.AllNumber == 0 ? 1 : data0.AllNumber;//总票数
                            this.percent1 = (this.value1 / this.favour * 100).toFixed(2) * 1;//赞同百分比
                            this.percent2 = (this.value2 / this.favour * 100).toFixed(2) * 1;//反对百分比
                            this.percent3 = (this.value3 / this.favour * 100).toFixed(2) * 1;//弃权百分比
                            this.percent4 = 0;//暂时无用字段
                            if (data00.Meetingstate == 2) {//会议直播已结束
                                clearInterval(this.stopInterVal);//停止周期轮询
                                var cookiesValue = Cookies.get("Admin-Token");
                                if (cookiesValue == "editor") {//判断是否是管理员,管理员不能参与评议
                                    this.$Message.success("直播已结束,请对直播过程评价");
                                    this.modelValue = true;
                                } else {
                                    this.$Message.success("当前会议直播已结束");
                                }
                            }
                            //}
                        }
                    }).catch(error => {
                        console.log(error + "error网络异常");
                    });
                }, 3000)

            },
            test_logout() {
                this.$store.dispatch('LogOut').then(() => {
                    this.$router.push({path: '/login'});
                }).catch(err => {
                    this.$message.error(err);
                });
            }, go() {
                this.timer = setInterval(() => {
                    this.autoPlay()
                }, 5000)
            },
            stop() {
                clearInterval(this.timer)
                this.timer = null
            },
            change(index) {
                this.currentIndex = index
            },
            autoPlay() {
                this.currentIndex++
                if (this.currentIndex > this.slideList.length - 1) {
                    this.currentIndex = 0
                }
            }
        },
        mounted() {
        },
        destroyed: function () {//离开页面时执行函数
            clearInterval(this.stopInterVal);//停止周期轮询
            clearInterval(this.showFlag);
            clearInterval(this.getNewUserListFlag);
        }
    }
</script>


<style type="text/css" scoped>
    .carousel-wrap {
        margin: 0px auto;
        height: 80%;
        width: 260px;
        overflow: hidden;
        background-color: #eff0f4;
        text-align: center;
    }

    .slide-ul {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .slide-ul li {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    img {
        width: auto;
        height: 100%;
    }

    .carousel-items {
        position: absolute;
        z-index: 1;
        /*top: 880px;*/
        bottom: -10px;
        left: auto;
        width: 100%;
        margin: 0 auto;
        text-align: center;
        font-size: 0;
    }

    .carousel-items span {
        display: inline-block;
        height: 6px;
        width: 30px;
        margin: 0 3px;
        background-color: #b2b2b2;
        cursor: pointer;
    }

    .carousel-items .active {
        background-color: orange;
    }

    .list-enter-to {
        transition: all 1s ease;
        transform: translateX(0);
    }

    .list-leave-active {
        transition: all 1s ease;
        transform: translateX(-100%)
    }

    .list-enter {
        transform: translateX(100%)
    }

    .list-leave {
        transform: translateX(0)
    }

    .state-overview {
        color: #fff
    }

    .state-overview .ivu-col {
        margin-bottom: 20px
    }

    .state-overview .state-value .value {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 5px
    }

    .state-overview .state-value .title {
        font-size: 14px
    }

    .state-value {
        width: 60%;
        display: inline-block
    }

    .symbol {
        width: 35%;
        display: inline-block
    }

    .state-overview .panel {
        border-radius: 4px;
        padding: 25px 20px
    }

    .panel.purple {
        background: #6a8abe;
        box-shadow: 0 5px 0 #5f7cab
    }

    .panel.red {
        background-color: #fc8675;
        box-shadow: 0 5px 0 #e27869
    }

    .panel.blue {
        background: #5ab6df;
        box-shadow: 0 5px 0 #51a3c8
    }

    .panel.green {
        background: #4acacb;
        box-shadow: 0 5px 0 #42b5b6
    }

    .dash_income_chart {
        float: left
    }

    .ivu-row {
        margin-bottom: 20px !important
    }

    .dash_income {
        border-radius: 4px;
        background-color: #fff;
        height: 80px;
        padding: 15px
    }

    .staff_name {
        font-weight: 900;
        font-size: 16px
    }

    .staff_progress {
        margin-left: 10px;
        width: 90%
    }

    .staff_progress p {
        margin: 0
    }

    .staff_list {
        border-radius: 4px;
        margin-top: 0;
        height: 90px;
        display: flex;
        align-items: center
    }

    .animated {
        background-color: #eff0f4
    }

    li {
        margin-bottom: 11px;
        margin-left: 10px;
        margin-right: 10px
    }

    .num {
        font-weight: 700
    }

    .time {
        font-size: 14px;
        font-weight: 700
    }

    .content {
        padding-left: 5px
    }

    .dashboard_feature {
        text-align: center
    }

    .demo-carousel {
        height: 600px;
        line-height: 200px;
        text-align: center;
        color: #fff;
        font-size: 20px;
        background: #506b9e
    }

    .demo-carousel img {
        height: 100%;
        width: 100%
    }

    h3, h4, h5 {
        margin: 12px
    }

    h3 {
        margin-bottom: 20px
    }

    p {
        margin: 12px
    }

    .row-margin-top {
        margin-top: 30px
    }

    .state-info {
        position: absolute;
        right: 15px;
        top: 20px;
        margin-bottom: 30px
    }

    .state-info .panel {
        margin-bottom: 20px;
        float: right;
        margin-left: 15px
    }

    .panel {
        background-color: #fff;
        border: 1px solid transparent;
        border-radius: 4px;
        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
        box-shadow: 0 1px 1px rgba(0, 0, 0, .05)
    }

    .panel-body {
        padding: 15px
    }

    .state-info .panel .summary {
        float: left;
        margin-right: 20px
    }

    .state-info .panel .summary span {
        color: #49586e;
        font-size: 13px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 10px
    }

    .state-info .panel .summary h3.red-txt {
        color: #fc8675
    }

    .state-info .panel .summary h3.green-txt {
        color: #65cea7
    }

    .state-info .panel .summary h3 {
        font-size: 200%;
        font-weight: 700;
        line-height: 20px;
        margin: 0
    }

    .page-heading h3 {
        color: #49586e;
        font-size: 25px;
        font-size: 11%;
        font-weight: 400;
        margin: 10px 0
    }

    .chart-bar {
        float: right;
        margin-top: 5px
    }

    .chart-bar img {
        display: inline-block;
        width: 68px;
        height: 45px;
        vertical-align: top
    }

    @media screen and (max-width: 767px) {
        .state-info {
            position: static;
            width: 100%;
            margin-top: 15px
        }

        .state-info .panel {
            width: 100%
        }
    }

    .panel.blue-box {
        background: none repeat scroll 0 0 #5ab5de;
        box-shadow: 0 5px 0 #51a3c7;
        color: #fff
    }

    .twt-info h3 {
        font-family: 'Open Sans', sans-serif;
        font-size: 16px;
        font-weight: 900;
        margin: 10px 0 30px 0;
        text-align: center
    }

    .twt-info p {
        font-size: 18px;
        line-height: 25px;
        font-style: italic;
        margin: 0 0 20px 0;
        text-align: center
    }

    .twt-info p a {
        color: #98fdf4
    }

    .media:first-child {
        margin-top: 0
    }

    .media.usr-info > .pull-left {
        margin-right: 20px;
        margin-top: 10px
    }

    .media > .pull-left {
        margin-right: 10px
    }

    .pull-left {
        float: left
    }

    .pull-left {
        float: left !important
    }

    .custom-trq-footer {
        background: none repeat scroll 0 0 #4eb6b7 !important;
        box-shadow: 0 5px 0 #46a3a4;
        color: #fff;
        border-top: none
    }

    .panel-footer {
        padding: 10px 15px;
        background-color: #f5f5f5;
        border-top: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px
    }

    .usr-info .thumb {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        -webkit-border-radius: 50%
    }

    .usr-info img {
        vertical-align: middle
    }

    .usr-info h4 {
        color: #658585;
        margin-bottom: 0
    }

    .media-heading {
        margin: 0 0 5px
    }

    .usr-info .media-body span {
        color: #ea755c;
        font-size: 12px;
        margin-bottom: 20px;
        display: inline-block
    }

    .usr-info .media-body p {
        color: #b6bcbc
    }

    ul.user-states {
        list-style-type: none;
        padding: 20px 0
    }

    ul.user-states li {
        text-align: center;
        float: left;
        width: 33%;
        font-size: 18px;
        margin: 0
    }

    .ulclass li {
        list-style: none;
    }

    .flex-1 {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .item1 {
        width: 50%;

    }

    tr {
        height: 20px;
    }

    .myimg {
        height: 100%;
        border: 5px white solid;

    }

    table {
        font-size: 16px;

    }

    #newInfoDiv {
        font-size: 16px;
    }

    @media (max-width: 700px) {
        .myimg {
            width: 100%;
            height: auto;
        }

        .flex-1 {
            height: 50vh;
        }

        table p {
            margin: 0px;

        }

        table {
            font-size: 12px;

        }

        #newInfoDiv {
            font-size: 12px;
        }

        .carousel-wrap {
            margin: 0px auto;
            height: 50%;
            width: 260px;
            overflow: hidden;
            background-color: #eff0f4;
            text-align: center;
        }
    }

    @media (max-height: 600px) {
        .myimg {
            width: auto;
            height: 40vh;
        }

        #newInfoDiv {
            font-size: 12px;
        }

        .flex-1 {
            height: 55vh;
        }

        table p {
            margin: 0px;
        }

        table {
            font-size: 12px;
        }
    }
</style>