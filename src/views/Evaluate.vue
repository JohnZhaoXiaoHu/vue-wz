<template>

    <div>
        <Row>
            <Col span="24">

                <div style="">
                    <h1>{{title_header}}</h1><br><br>
                    <Form :model="formItem" :label-width="80">

                        <Form-item label="是否满意">
                            <Radio-group v-model="formItem.radio">
                                <Radio label='y'>满意</Radio>
                                <Radio label='n'>不满意</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="评议内容">
                            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                                   placeholder="请对本次直播会议进行评议"></Input>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="submitInfo()">提 交</Button>
                        </Form-item>
                    </Form>
                </div>
            </Col>
        </Row>
    </div>

</template>
<script>

    import Cookies from 'js-cookie';
    import qs from "qs";
    import axios from "axios"

    export default {
        data() {
            return {
                title_header: "评议直播",
                formItem: {
                    radio: 'y',
                    textarea: '',
                    meetId: ""
                },
            }
        },//data
        created() {
            this.init()
        },
        methods: {
            init() {
                const power = Cookies.get("Admin-Token");
                this.formItem.meetId = Cookies.get("meetId");
                if (power == "admin") {//管理员不可进入评议
                    this.$Message.error("您是【管理员】身份登录,不可参与评议");
                    this.$router.push({path: '/'});
                } else if (this.formItem.meetId == undefined || this.formItem.meetId == "" || this.formItem.meetId == null) {
                    this.$Message.error("请选择会议");
                    this.$router.push({path: '/'});
                }
            },
            submitInfo() {
                if (index == 2) {

                }
                const Uname = Cookies.get("UserName");
                const Evaluated = Cookies.get("Evaluated");
                //todo 查询当前用户是否已评议
                if (Evaluated != (Uname + "_" + this.formItem.meetId)) {//未评议过此次会议
                    axios.post("/proc/VoteMeeting", qs.stringify(//未测试
                        {
                            id: this.formItem.meetId,
                            userid: Cookies.get("userid"),
                            userexperience: this.formItem.radio == "y" ? 1 : 2,
                            experiencecontent: this.formItem.textarea == "" ? "用户未填写评价" : this.formItem.textarea
                        }
                    )).then(response => {
                        if (response.data.ErrCode == -5) {//未登录时清除cookies并回到登录页
                            Cookies.remove('Admin-Token');
                            Cookies.remove('UserName');
                            window.location.reload();
                        }
                        const data0 = response.data;
                        if (data0.ErrCode == -5) {
                            Cookies.remove('Admin-Token');
                            Cookies.remove('UserName');
                            window.location.reload();
                        }
                        if (data0.ErrCode == 0) {
                            this.$Message.success('评价成功');
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

        }

    }
</script>



