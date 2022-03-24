<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status==='0'" type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改的对话框 -->
      <el-dialog
        title="修改地址"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="dialogClose('editFormRef')"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="roleName">
            <el-cascader
              v-model="local"
              :options="city"
              :props="cascaderProps"
              @change="addressChange"
              clearable
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="roleDesc">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示物流信息 -->
      <el-dialog
        title="物流信息"
        :visible.sync="showDialogVisible"
        width="50%"
        @close="showDialogVisible = false"
      >
        <!-- <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区/县" prop="roleName">
            <el-cascader
              v-model="local"
              :options="city"
              :props="cascaderProps"
              @change="addressChange"
              clearable
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="roleDesc">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form> -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import city from "./data.city.js";
export default {
  data() {
    return {
      // 获取商品列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      editDialogVisible: false,
      local: '',
      city: city,
      cascaderProps: {
        value: 'value',
        label: 'text',
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false,
      },
      editForm: {
        address1: "",
        address2: "",
      },
      editFormRules: {
        address1: [
          { required: true, message: "请输入地区名称", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      showDialogVisible: false,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听page改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.queryInfo.pagenum = 1;
      this.getOrderList();
    },
    // 监听当前页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    changeInfo() {},
    addressChange(){

    },
    showDialog(info) {
      this.editDialogVisible = true;
    },
    dialogClose(ref){
      console.log(this.local)
      this.$refs[ref].resetFields()
    },
    async showProgress(){
      // 物流进度接口失效
      // const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      // // console.log(res);
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.showDialogVisible = true
    }
  },
};
</script>

<style lang="less" scoped>
// .el-cascader{
//     height: 300px;
// }
</style>