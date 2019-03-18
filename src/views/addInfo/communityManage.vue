<template>

    <div>

        <Row>
            <Col span="24">

                <div style="" class="doc-header">
                    <br>
                    <h3 align="center">社区管理</h3>
                    <br><br>
                    <!--<Table align="center" :columns="columns" :data="data1">-->
                    <Table align="center" :columns="columns" :data="data1">
                    </Table>
                    <Modal v-model="model1" title="新增社区" @on-ok="addOk" @on-cancel="addCancel">
                        <Form :model="formAdd" label-position="top">
                            <Form-item label="输入名称">
                                <Input v-model="formAdd.input1"></Input>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model2" title="修改社区名称" @on-ok="updateOk" @on-cancel="updateCancel">
                        <Form :model="formAdd" label-position="top">
                            <Form-item label="输入名称">
                                <Input v-model="formAdd.input2"></Input>
                            </Form-item>
                        </Form>
                    </Modal>
                    <Modal v-model="model3" title="删除提示" @on-ok="delOk" @on-cancel="delCancel">
                        <p>您将删除 [ {{communityName}} ]<br>是否确认删除?</p>
                    </Modal>

                </div>
                <div style="" class="doc-header">
                    <Form ref="formDynamic" :model="formDynamic" :label-width="80">
                        <Form-item>
                            <Button type="dashed" long @click="modelAdd()" icon="plus-round">新增社区</Button>
                            <Button type=""></Button>
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
                model1: false,
                model2: false,
                model3: false,
                communityId: 0,
                communityName: "",
                formAdd: {
                    input1: "",
                    input2: ""
                },
                columns: [
                    {
                        title: '社区编号',
                        align: 'center',
                        key: 'Id'
                    },
                    {
                        title: '社区名称',
                        align: 'center',
                        key: 'Communityname'
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
                                            this.modelUpdate(params.index)
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
                                            this.meetManage(params.index)
                                        }
                                    }
                                }, '会议'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.modelDel(params.index)
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
            this.reloadPage();
        },
        methods: {
            updateName() {//修改社区信息
                // todo update the name of community to DB
                axios.post("/admin/UpdateCommunityInfo", qs.stringify({//pass double
                    id: this.communityId,
                    communityname: this.formAdd.input2
                })).then(response => {
                    const data0 = response.data;
                    if (data0.ErrCode == 0) {
                        this.$Message.success("修改成功");
                        this.formAdd.input2 = "";
                        this.reloadPage();//修改成功后刷新当前界面
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log("修改社区异常");
                    console.log(error);
                });
            },

            modelAdd() {
                this.model1 = true;
            },
            addOk() {
                this.model1 = false;
                if (this.formAdd.input1 != "") {
                    this.handleAdd();
                } else {
                    this.$Message.error("社区名不能为空");
                }
            },
            addCancel() {
                this.model1 = false;
                this.formAdd.input1 = "";
            },
            modelUpdate(index) {
                this.communityId = this.data1[index].Id;
                this.model2 = true;
            },
            updateOk() {
                this.model2 = false;
                if (this.formAdd.input2 != "") {
                    this.updateName();
                } else {
                    this.$Message.error("社区名不能为空");
                }
            },
            updateCancel() {
                this.model2 = false;
                this.formAdd.input2 = "";
            },
            modelDel(index) {
                this.model3 = true;
                this.communityName = this.data1[index].Communityname;
                this.communityId = this.data1[index].Id;
            },
            delOk() {
                this.model3 = false;
                this.handleRemove();
            },
            delCancel() {
                this.model3 = false;
            },

            meetManage(index) {
                this.$router.push({
                    path: '/addInfo/meetManage', query: {
                        index: this.data1[index].Id
                    }
                });
            },
            handleAdd() {//添加新的社区
                axios.post("/admin/AddCommunityInfo", qs.stringify({//pass double
                    communityname: this.formAdd.input1
                })).then(response => {
                    const data0 = response.data;
                    if (data0.ErrCode == 0) {
                        this.$Message.success("添加社区成功");
                        this.formAdd.input1 = "";
                        this.reloadPage();//添加成功后刷新当前界面
                    } else {//社区已存在的情况
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log('添加社区异常');
                    console.log(error);
                })
            },
            handleRemove() {//删除社区
                // todo delete community from DB
                axios.post("/admin/DelCommunityInfo", qs.stringify({//pass double
                    id: this.communityId
                })).then(response => {
                    const data0 = response.data;
                    if (data0.ErrCode == 0) {
                        this.$Message.success("删除社区成功");
                        this.reloadPage();//删除成功后刷新当前界面
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log("删除社区异常");
                    console.log(error);
                });
            },
            reloadPage() {//加载社区
                //todo select info
                axios.get("/admin/GetCommunityList").then(response => {//pass double
                    const data0 = response.data;
                    if(response.data.ErrCode==-5){//未登录时清除cookies并回到登录页
                        Cookies.remove('Admin-Token');
                        Cookies.remove('UserName');
                        window.location.reload();
                    }
                    if(data0.ErrCode==0){
                        this.data1 = data0.Result;
                    }else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        }

    }
</script>



