<template>

    <div>

        <Row>
            <Col span="24">

                <div style="" class="doc-header">
                    <br>
                    <h3 align="center">会议管理</h3>
                    <br><br>
                    <!--<Table align="center" :columns="columns" :data="data1">-->
                    <Table align="center" :columns="columns" :data="data1">
                    </Table><br><br>
                    <select id="sendSybol" v-model="cityList.sendSymbolId" style="border:1px solid #dddee1;border-radius:4px; width: 200px;height: 35px;color:#495060">
                        <option style="height: 50px;padding:7px 16px;"  v-for="item  in cityList" name="sendSymbolId" :value="item.value" >{{item.label}}</option>
                    </select>

                </div>
                <div style="" class="doc-header">


                    <Form ref="formDynamic" :model="formDynamic" :label-width="80">
                        <Form-item>
                            <Button type="dashed" long @click="handleAdd()" icon="plus-round">新增社区</Button>
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
                model1: "beijing",
                cityList:[

                ],
                columns: [
                    {
                        title: '会议编号',
                        key: 'id'
                    },
                    {
                        title: '社区名称',
                        key: 'communityname'
                    },
                    {
                        title: '会议名称',
                        key: 'meetingname'
                    },
                    {
                        title: '会议内容',
                        key: 'meetingcontent'
                    },

                    {
                        title: '开始时间',
                        key: 'begintime'
                    },
                    {
                        title: '结束时间',
                        key: 'endtime'
                    },
                    {
                        title: '会议状态',
                        key: 'meetingstate'
                    },
                    {
                        title: '用户体验结果',
                        key: 'userexperience'
                    },

                    {
                        title: '操作',
                        key: 'action',
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
                                            this.userManage(params.index)
                                        }
                                    }
                                }, '用户管理'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleRemove(params.index)
                                        }
                                    }
                                }, '删除会议')
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
            this.reloadPage();
        },
        methods: {
            userManage(index) {
                //todo enter the page of usermanage
                this.$router.push({
                    path: '/addInfo/meetManage', query: {
                        index: this.data1[index].Id
                    }
                });
            },
            handleAdd() {//新建会议
                this.$router.push();
            },
            handleRemove(index) {//删除会议
                const Id = this.data1[index].Id;
                // todo delete community from DB
                axios.post("/deleteCommunity", qs.stringify({
                    Id: Id
                })).then(response => {
                    const data0 = response.data;
                    if (data0.ErrCode == 1) {
                        this.$Message.success("删除会议成功");
                        this.reloadPage();//删除成功后刷新当前界面
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log("删除会议异常");
                    console.log(error);
                })
                this.reloadPage();
            },
            reloadPage() {
                // this.cityList=this.cityList1;
                var communityId = this.$route.query.index;
                //todo select info
                axios.get("//admin/GetMeetingList", {params: {
                    userName: communityId
                }}).then(response => {
                    //todo initValue
                    //this.columns = response.data.Result;
                }).catch(error => {
                    console.log(error);
                })
            }
        }

    }
</script>



