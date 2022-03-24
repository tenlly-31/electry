<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类</span>
          <el-cascader
            v-model="SelectedOption"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            :disabled="SelectedOption.length == 0"
            type="primary"
            @click="showAddDialog"
            >添加参数</el-button
          >
          <el-table :data="manyData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeParam(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="SelectedOption.length == 0"
            type="primary"
            @click="showAddDialog"
            >添加属性</el-button
          >
          <el-table :data="onlyData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    size="mini"
                    @click="showEditDialog(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    size="mini"
                    @click="removeParam(scope.row.attr_id)"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="titleText1 + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @closed="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
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
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: false
      },
      SelectedOption: [],
      activeName: "many",
      manyData: [],
      onlyData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: "",
        attr_id: 0,
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            trigger: "blur",
            message: "请输入参数名称",
          },
        ],
      },
      titleText1: "添加",
    };
  },
  computed: {
    cateId() {
      if (this.SelectedOption.length !== 3) return null;
      return this.SelectedOption[2];
    },
    titleText() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.cateList = res.data;
    },
    async handleChange() {
      if(this.SelectedOption.length !== 3){
        this.SelectedOption = []
        this.manyData = []
        this.onlyData = []
        return
      }
      this.getParamsData();
    },
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        //控制文本框的显示与隐藏
        item.inputVisible = false;
        item.inputValue = "";
      });
      if (this.activeName === "many") this.manyData = res.data;
      else this.onlyData = res.data;
    },
    handleClick() {
      if(!this.SelectedOption.length) return
      this.getParamsData();
    },
    showAddDialog() {
      this.titleText1 = "添加";
      this.addDialogVisible = true;
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    showEditDialog(info) {
      console.log(info);
      this.titleText1 = "修改";
      this.addForm = info;
      this.addDialogVisible = true;
    },
    editParams(id) {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.addForm.attr_id}`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.getParamsData();
        this.addDialogVisible = false;
      });
    },
    checkAddEdit() {
      if (this.titleText1 === "添加") this.addParams();
      else this.editParams();
    },
    removeParam(id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.cateId}/attributes/${id}`
          );
          if (res.meta.status !== 200)
            return this.$message.error(res.meta.message);
          this.getParamsData();
          this.$message.success("删除成功!");
        })
        .catch();
    },
    // 文本框失去焦点或按下enter键
    async handleInputConfirm(info) {
      if (info.inputValue.trim().length === 0) {
        info.inputValue = "";
        return;
      }
      info.attr_vals.push(info.inputValue.trim());
      info.inputValue = "";
      info.inputVisible = false;
      // 发起请求提交参数
      this.saveAttrValues(info)
    },
    showInput(info) {
      info.inputVisible = true;
      // 自动获得焦点
      // $nextTick是当页面被重新渲染才调用回调函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async saveAttrValues(info) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${info.attr_id}`,
        {
          attr_name: info.attr_name,
          attr_sel: info.attr_sel,
          attr_vals: info.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
    },
    handleClose(i, info) {
      info.attr_vals.splice(i, 1);
      this.saveAttrValues(info)
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 90px;
}
</style>