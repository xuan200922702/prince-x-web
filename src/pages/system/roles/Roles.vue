<script>
import NewRole from "@/pages/system/roles/NewRole";
import EditRole from "@/pages/system/roles/EditRole";
  export default {
    components: {NewRole,EditRole}
  }
</script>
<template>
  <a-card>
    <div >
      <a-form-model    ref="formSearch"  :model="roleSearchForm"   layout="horizontal"  >
        <div>
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-model-item
                      label="角色名称"
                      :labelCol="{span: 5}"
                      :wrapperCol="{span: 18, offset: 1}"
                      ref="roleName"  prop="roleName"
              >
                <a-input v-model="roleSearchForm.roleName"
                         placeholder="请输入角色名" />
              </a-form-model-item >
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-model-item  class="roleKey"
                                  label="权限字符"
                                  :labelCol="{span: 5}"
                                  :wrapperCol="{span: 18, offset: 1}"
                                  ref="roleKey"  prop="roleKey"
              >
                <a-input v-model="roleSearchForm.roleKey" placeholder="请输入权限字符" />
              </a-form-model-item >
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-model-item
                      label="状态"
                      :labelCol="{span: 5}"
                      :wrapperCol="{span: 18, offset: 1}"
                      ref="status"  prop="status"
              >
                <a-select v-model="roleSearchForm.status"  placeholder="请选择状态">
                  <a-select-option value="0">启用</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
              </a-form-model-item >
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
                <a-button type="primary"  @click="roleSearch"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 10px" @click="resetSearch" ><a-icon type="rest" />重置</a-button>
                </span>
      </a-form-model>
    </div>
    <br/><br/>
    <div>
      <div class="operator">
        <a-button class="ned" @click="addRole" type="primary"><a-icon type="plus" />新建</a-button>
        <a-button class="ned" @click="deleteRoles" type="danger"><a-icon type="delete" />删除</a-button>
      </div>
      <standard-table
              :columns="columns"
              :data-source="dataSourcelist"
              :selectedRows.sync="selectedRows"
              rowKey="roleId"
              :pagination="{onChange:(page) =>pageChange(page),onShowSizeChange:(current,size) =>pagesizeChange(current,size),showTotal:total => `总共 ${total} 条`,pageSize:pageSize,showSizeChanger:true,total:count}"
              @clear="onClear"
      >
        <div slot="status">
          <a-switch default-checked @change="onChangeStaus" />
        </div>
        <div slot="action" slot-scope="{text,record}">
          <a-button type="link" @click="editRole(record)" >
            <a-icon type="edit" />修改
          </a-button>
          <a-button type="link"  @click="deleteRole(record)">
            <a-icon type="delete"/>删除
          </a-button>

        </div>
      </standard-table>
      <!--新建角色模块-->
      <div>
        <new-role  :menus="menudata"  v-model="addrolevisible"   @success="createSuccess"   />
      </div>
      <!--修改角色模块-->
      <div>
        <edit-role :menus="menudata"  :role="editRoles" v-model="editdeptvisible"  @success="editSuccess "/>
      </div>
      <div>
      </div>
    </div>
  </a-card>
</template>
<script>
  import StandardTable from '@/components/table/StandardTable'
  import NewRole from  '@/pages/system/roles/NewRole'
  import EditRole from "@/pages/system/roles/EditRole";

  import {princemenulist, deleteprincerole,rolelist,princedeptlist,geteprincerole} from '@/services'
  import moment from 'moment'
  // import {mapState} from "vuex";
  const columns = [
    {
      title: '角色编号',
      dataIndex: 'roleId'
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      align: "center"
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      align: "center"
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' },
      align: "center"
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: "center",
      customRender: (text) => {
        return moment(text).format('YYYY年MM月DD日HH时mm分')
      }
    },
    {
      title: '操作',
      scopedSlots: { customRender: 'action' },
      align: "center"
    }
  ]
  export default {
    name: 'QueryList',
    components: {
      StandardTable,
      NewRole,
      EditRole,
    },
    data () {
      return {
        editRoles:{},
        loading: false,
        newpasswordvisible: false,
        addrolevisible: false,
        editdeptvisible: false,
        columns: columns,
        dataSourcelist: [],
        selectedRows: [],
        pageSize: 10,
        count: 0,
        pageIndex: 1,
        roleSearchForm: {
          roleName: undefined,
          roleKey: undefined,
          status: undefined,
        },
        rolesdata: [],
        menudata:[],
        deptdata:[],
      }
    },
    mounted() {
      this.princeRoleList()
      this.princeMenuList()
      this.princeDeptList()
    },

    methods: {
      //获取角色列表
      princeRoleList(pageIndex = this.pageIndex, pageSize = this.pageSize, roleName = this.roleSearchForm.roleName, roleKey = this.roleSearchForm.roleKey, status=this.roleSearchForm.status){
        rolelist(pageIndex,pageSize,roleName,roleKey,status).then(res =>{
          this.dataSourcelist = res.data.data.list
          this.count = res.data.data.count
          this.pageSize = res.data.data.pageSize
          this.pageIndex = res.data.data.pageIndex
          this.roleName = res.data.data.list.roleName
          this.roleKey = res.data.data.list.roleKey
          this.status = res.data.data.list.status
        })
      },

      //获取分页
      pageChange(page) {
        this.princeRoleList(page)
      },
      pagesizeChange(current,size) {
        this.princeRoleList(current,size)
      },
      //搜索
      roleSearch(){
        this.princeRoleList()

      },
      resetSearch() {
        this.$refs.formSearch.resetFields()
      },

      //获取菜单列表
      princeMenuList(){
        princemenulist().then(res =>{
          this.menudata=res.data.data
        })
      },
      //获取部门列表
      princeDeptList(){
        princedeptlist().then(res =>{
          this.deptdata=res.data.data
        })
      },
      //新建角色
      addRole() {
        this.addrolevisible = true

      },
      createSuccess(){
        this.princeRoleList()
      },
      //修改角色
      editRole(record) {
        this.editdeptvisible = true;
        geteprincerole(record).then(res =>{
          this.editRoles = res.data.data
        })

      },
      editSuccess(){
        this.princeRoleList()
      },
      //删除角色
      deleteRole(record){
        const _this = this
        this.$confirm({
          title: '警告',
          content: '是否确认删除此角色?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            console.log(record)
            deleteprincerole(record).then(_this.afterDeleteRole)
          },
          onCancel() {},
        });
      },
      afterDeleteRole(res){
        const result = res.data
        if(result.code === 200){
          this.princeRoleList()
          this.$message.success(result.msg, 3)
        }else {
          this.princeRoleList()
          this.$message.error(result.msg, 3)
        }
      },
      deleteRoles(){
        const _this = this
        const roleIds=[]
        this.selectedRows.forEach(c =>roleIds.push({"roleId": c.roleId }) )
        this.$confirm({
          title: '警告',
          content: '是否确认删除选中的角色?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            roleIds.forEach(c =>deleteprincerole(c).then(_this.afterDeleteRole))
          },
          onCancel() {},
        });
      },


      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      onChangeStaus(checked) {
        console.log(`a-switch to ${checked}`);
      },
      remove () {
        this.dataSourcelist= this.dataSourcelist.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
        this.selectedRows = []
      },
      onClear() {
        this.$message.info('您清空了勾选的所有行')
      },
      handleMenuClick (e) {
        if (e.key === 'delete') {
          this.remove()
        }
      }
    }
  }

</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  .ned{
    margin-left:10px;
  }
  .roleKey{
    margin-left:10px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
