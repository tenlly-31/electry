<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage"> 添加商品 </el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="showDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        title="修改商品内容"
        :visible.sync="dialogVisible"
        width="50%"
        @closed="dialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="100px"
        >
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品介绍" prop="goods_introduce">
            <el-input v-model="editForm.goods_introduce"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="editForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量/g" prop="goods_weight">
            <el-input v-model="editForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品价格/￥" prop="goods_price">
            <el-input v-model="editForm.goods_price" type="number"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGood">确 定</el-button>
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
      goodsList: [],
      dialogVisible: false,
      editForm: {
        goods_name: "",
        goods_id: 0,
        attrs: [],
        goods_introduce: "",
        goods_number: 0,
        goods_price: 0,
        goods_weight: 0,
      },
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听page改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.queryInfo.pagenum = 1;
      this.getGoodsList();
    },
    // 监听当前页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async showDialog(info) {
      const { data: res } = await this.$http.get(`goods/${info.goods_id}`);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品信息失败！");
      console.log(res);
      this.editForm = res.data;
      const intro = res.data.goods_introduce
      this.editForm.goods_introduce = intro?intro.slice(3,intro.length-4) : ''
      this.dialogVisible = true;
    },
    dialogClosed() {
      this.editForm = {
        goods_name: "",
        goods_id: 0,
        attrs: [],
        goods_introduce: "",
        goods_number: 0,
        goods_price: 0,
        goods_weight: 0,
      };
    },
    editGood() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return false
        const {data: res} = await this.$http.put(`goods/${this.editForm.goods_id}`,this.editForm)
        if(res.meta.status !== 200) return this.$message.error('修改商品信息失败！')
        this.$message.success('修改成功！')
        this.getGoodsList()
        this.dialogVisible = false
      })
    },
    removeGoods(info) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `goods/${info.good_id}`
          );
          if (res.meta.status !== 200)
            return this.$message.error("删除商品失败");
          this.getGoodsList();
          this.$message.success("删除成功!");
        })
        .catch();
    },
    goAddpage() {
      this.$router.push("/goods/add");
    },
  },
};
</script>

<style lang="less" scoped>
</style>