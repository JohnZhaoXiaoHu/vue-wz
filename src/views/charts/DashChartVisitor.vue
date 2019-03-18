<template>

    <Col :span="24">
        <chart :options="option" class="echarts" id="chart"></chart>
    </Col>

</template>

<style scoped>
    .echarts {
        border-radius: 4px;
        height: 250px;
        width: 100%;
    }
</style>

<script>
    import Bus from '../Bus.js'
    import axios from "axios"

    var voteData = [{
        value: 0,
        name: '满意'
    }, {
        value: 0,
        name: '不满意'
    }];

    export default {
        mounted() {
            var vm = this
            // 用$on事件来接收参数
            Bus.$on('val', (Id) => {
                this.getVote(Id);
                voteData[0].value = 740;
                voteData[1].value = 160;
            });
        },
        created() {
        },
        methods: {
            getVote(Id) {
                //todo select vote
                axios.get("/admin/MeetingChart", {
                    params: {
                        MeetingId: Id
                    }
                }).then(response => {
                    const data0 = response.data;
                    if (data0.ErrCode == 0) {
                        //todo initValue
                        voteData[0].value = data0.Result.Affirmativevote;
                        voteData[1].value = data0.Result.Dissentingvote;
                    } else {
                        this.$Message.error(data0.ErrMsg);
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        },

        data() {
            return {
                value11: 0,
                option: {
                    backgroundColor: '#49586e',
                    title: {
                        text: "会议满意度统计",
                        x: 'center',
                        y: 'top',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 20,
                            color: '#fff',
                        }
                    },
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{b}: {c}票 ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        right: '5%',
                        top: '25%',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 16,
                            color: '#fff',
                        },
                        data: ['满意', '不满意']
                    },
                    series: [{
                        type: 'pie',
                        selectedMode: 'single',
                        center: ['30%', '50%'],
                        radius: ['50%', '80%'],
                        // color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67'],
                        color: ['green', 'orange'],
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{d}%',

                                textStyle: {
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 12
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: voteData
                    }]
                },
            }
        }
    }
</script>