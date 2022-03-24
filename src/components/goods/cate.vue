<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button class="addButton" type="primary" @click="showAddCate"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <tree-table
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          border
        >
          <template slot="isOk" slot-scope="scope">
            <i
              v-if="scope.row.cat_delete"
              class="el-icon-success"
              style="color: lightgreen"
            ></i>
            <i v-else class="el-icon-error" style="color: red"></i>
          </template>
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level == '1'" type="success"
              >二级</el-tag
            >
            <el-tag v-else type="warning">三级</el-tag>
          </template>
          <template slot="opt" slot-scope="scope">
            <div>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeGood(scope.row.cat_id)"
                >删除</el-button
              >
            </div>
          </template>
        </tree-table>
      </el-row>
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
      <!-- 添加分类的对话框 -->
      <el-dialog
        :title="titleText"
        :visible.sync="addCateDialogVisible"
        width="50%"
        @close="dialogClose('addCateFormRef')"
      >
        <el-form
          :model="addCate"
          :rules="addCateRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCate.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="SelectedOptions"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkAddEdit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      cateList: [],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          prop: "cat_delete",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          prop: "cat_delete",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],

      addCateDialogVisible: false,
      addCate: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
        cat_id: 0,
      },
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //   父级分类
      parentCateList: [],
      SelectedOptions: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      titleText: "添加分类",
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.message);
      this.cateList = res.data.result;
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
    showAddCate() {
      this.titleText = "添加分类";
      this.SelectedOptions = [];
      this.addCate.cat_name = "";
      this.addCate.cat_pid = 0;
      this.addCate.cat_level = 0;
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.message);
      this.parentCateList = res.data;
    },
    // 分类改变
    parentCateChange() {
      if (this.SelectedOptions.length > 0) {
        this.addCate.cat_pid =
          this.SelectedOptions[this.SelectedOptions.length - 1];
        this.addCate.cat_level = this.SelectedOptions.length;
      } else {
        this.addCate.cat_pid = 0;
        this.addCate.cat_level = 0;
      }
      this.addCate.cat_level = this.SelectedOptions.length;
      console.log(this.addCate);
    },
    showEditDialog(info) {
      this.titleText = "修改分类";
      this.addCate.cat_id = info.cat_id;
      this.addCate.cat_name = info.cat_name;
      // this.SelectedOptions =
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 关闭对话框
    dialogClose(ref) {
      this.$refs[ref].resetFields();
    },
    // 添加和修改分类
    addCates() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addCate);
        if (res.meta.status !== 201) {
          this.$message.error("添加分类失败");
          return;
        }
        this.$message.success("添加分类成功");
        this.getGoodsList();
        this.addCateDialogVisible = false;
      });
    },
    editDialog() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        console.log('数据内容：',this.addCate)
        this.addCate.cat_pid = this.SelectedOptions[this.SelectedOptions.length - 1]
        const { data: res } = await this.$http.put(
          `categories/${this.addCate.cat_id}`,
          this.addCate
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改分类失败");
          return;
        }
        this.$message.success("修改分类成功");
        this.getGoodsList();
        this.addCateDialogVisible = false;
      });
    },
    checkAddEdit() {
      if (this.titleText === "添加分类") this.addCates();
      else this.editDialog();
    },
    removeGood(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`);
          if (res.meta.status !== 200)
            return this.$message.error(res.meta.message);
          this.$message.success("删除成功!");
          this.getGoodsList();
        })
        .catch();
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-cascader {
  .el-cascader__wrap {
    height: 300px;
  }
}
.addButton {
  margin-bottom: 20px;
}
</style>