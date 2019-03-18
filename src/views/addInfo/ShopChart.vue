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



                </div>
                <div style="" class="doc-header">
                    <Form  ref="formDynamic" :model="formDynamic" :label-width="80">
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
                                }, '会议管理'),
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
                                }, '删除社区')
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
        created(){
            this.reloadPage();
        },
        methods: {
            meetManage(index){
                this.$router.push({
                    path: '/addInfo/meetManage', query: {
                        index: this.data1[index].Id
                    }
                });
            },
            handleAdd() {
                var cName = prompt("请输入社区名称");
                axios.post("/addCommunity",qs.stringify({
                    communityname:cName
                })).then(response =>{
                    const data0 = response.data;
                    if(data0.Result==1){
                        this.$Message.success("添加社区成功");
                        this.reloadPage();//添加成功后刷新当前界面
                    }else {//社区已存在的情况
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error =>{
                    console.log('添加社区异常');
                    console.log(error);
                })
                //todo insert into DB
            },
            handleRemove(index) {//删除社区
                const Id =this.data1[index].Id;
                // todo delete community from DB
                axios.post("/deleteCommunity",qs.stringify({
                    Id:Id
                })).then(response=>{
                    const data0 = response.data;
                    if(data0.ErrCode==1){
                        this.$Message.success("删除社区成功");
                        this.reloadPage();//删除成功后刷新当前界面
                    }else{
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error=>{
                   console.log("删除社区异常");
                   console.log(error);
                })
                this.reloadPage();
            },
            reloadPage(){
                //todo select info
                axios.get("/selectCommunity").then(response=>{
                    this.data1 = response.data.Result;
                }).catch(error=>{
                    console.log(error);
                })
            }
        }

    }
</script>



