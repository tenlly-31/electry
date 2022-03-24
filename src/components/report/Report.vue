<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 80%; height: 500px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echarts
import * as echarts from "echarts";
import _ from "lodash";

export default {
  data() {
    return {
      // 3.配置数据和配置项
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
        ],
      },
    };
  },
  async mounted() {
    // 2.初始化echarts图表
    var myChart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200)
      return this.$message.error("获取图表数据失败！");

    const result = _.merge(res.data, this.options);
    // 4.展示数据
    myChart.setOption(result);
  },
};
</script>

<style lang="less" scoped>
</style>