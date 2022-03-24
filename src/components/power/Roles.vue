<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="showAddRole"> 添加角色 </el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === '0' ? '' : 'bdtop']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
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
                @click="removeRole(scope.row.id)"
                >删除</el-button
              >
              <el-button
                type="text"
                icon="el-icon-setting"
                size="mini"
                @click="showDialog(scope.row)"
                >分配权限</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加用户的对话框 -->
      <el-dialog
        :title="titleText + '角色'"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="dialogClose('addFormRef')"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkAddEdit">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <!-- <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="dialogClose('editFormRef')"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog> -->
      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
      >
        <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          ref="treeRef"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      addDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
        id: 0,
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      titleText: "添加",
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认 选中的id值
      defKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolesList = res.data;
    },
    removeRight(role, id) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${id}`
          );
          if (res.meta.status !== 200) return this.$message.error("删除失败");
          // 重新赋值
          role.children = res.data;
          this.$message.success("删除成功!");
        })
        .catch();
    },
    async showDialog(role) {
      this.roleId = role.id;
      // 获取所有权限数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据失败");
      }
      this.rightsList = res.data;
      this.defKeys = [];
      this.getLeafKeys(role);
      this.setRightDialogVisible = true;
    },
    // 获取某一角色所有子节点的函数
    getLeafKeys(node) {
      if (!node.children) return this.defKeys.push(node.id);
      node.children.forEach((ele) => {
        this.getLeafKeys(ele);
      });
    },
    async allotRights(role) {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights/`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    showAddRole() {
      this.titleText = "添加";
      this.addForm = { roleName: "", roleDesc: "" };
      this.addDialogVisible = true;
    },
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        let info = { ...this.addForm };
        delete info.id;
        const { data: res } = await this.$http.post("roles", info);
        if (res.meta.status !== 201)
          return this.$message.error(this.meta.message);
        this.getRolesList();
        this.$message.success("添加角色成功！");
        this.addDialogVisible = false;
      });
    },
    showEditDialog(info) {
      this.titleText = "修改";
      this.addDialogVisible = true;
      this.addForm = info;
    },
    editRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // let obj = {...this.addForm, id: this.changeId}
        let { id } = this.addForm;
        const { data: res } = await this.$http.put(`roles/${id}`, this.addForm);
        if (res.meta.status !== 200)
          return this.$message.error(this.meta.message);
        this.getRolesList();
        this.$message.success("修改角色成功！");
        this.addDialogVisible = false;
      });
    },
    checkAddEdit() {
      if (this.titleText === "添加") this.addRole();
      else this.editRole();
    },
    removeRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200)
            return this.$message.error(res.meta.message);
          this.getRolesList()
          this.$message.success("删除成功!");
        })
        .catch();
    },
    dialogClose(ref) {
      this.$refs[ref].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>