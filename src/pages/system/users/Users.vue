<script>
  import NewUser from "@/pages/system/users/NewUser";
  import EditUser from "@/pages/system/users/EditUser";
  import NewPass from "@/pages/system/users/NewPass";
  export default {
    components: {NewPass, EditUser, NewUser}
  }
</script>
<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-content >
      <a-layout  class="user-left">
        <a-layout-sider  class="content" >
          <div class="search-left">
          <a-input-search class="search-left-child" placeholder="输入部门" style="width: calc(100% - 20px)" />
          </div>
           <br /><br />
          <a-menu
                  mode="inline"
                  :default-open-keys="[dept.deptId]"
                  v-for="dept in deptsdata" :value="dept.deptId" :key="dept.deptId"
          >
            <a-sub-menu>
              <span slot="title"><a-icon type="cloud" />{{dept.deptName}}</span>
              <a-menu-item v-for="child in dept.children"     :valaue="child.deptId" :key="child.deptId">
                 {{child.deptName}}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout-content>
          <a-card>
            <div >
              <a-form-model    ref="formSearch"  :model="userSearchForm"   layout="horizontal"  >
                <div>
                  <a-row >
                    <a-col :md="8" :sm="24" >
                      <a-form-model-item
                              label="用户名称"
                              :labelCol="{span: 5}"
                              :wrapperCol="{span: 18, offset: 1}"
                              ref="userName"  prop="userName"
                      >
                        <a-input v-model="userSearchForm.userName"
                                 placeholder="请输入用户名" />
                      </a-form-model-item >
                    </a-col>
                    <a-col :md="8" :sm="24" >
                      <a-form-model-item  class="phone"
                                   label="手机号"
                                   :labelCol="{span: 5}"
                                   :wrapperCol="{span: 18, offset: 1}"
                                   ref="phone"  prop="phone"
                      >
                        <a-input v-model="userSearchForm.phone" placeholder="请输入手机号" />
                      </a-form-model-item >
                    </a-col>
                    <a-col :md="8" :sm="24" >
                      <a-form-model-item
                              label="状态"
                              :labelCol="{span: 5}"
                              :wrapperCol="{span: 18, offset: 1}"
                              ref="status"  prop="status"
                      >
                        <a-select v-model="userSearchForm.status"  placeholder="请选择状态">
                          <a-select-option value="0">启用</a-select-option>
                          <a-select-option value="1">禁用</a-select-option>
                        </a-select>
                      </a-form-model-item >
                    </a-col>
                  </a-row>
                </div>
                <span style="float: right; margin-top: 3px;">
                <a-button type="primary"  @click="userSearch"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 10px" @click="resetSearch" ><a-icon type="rest" />重置</a-button>
                </span>
              </a-form-model>
            </div>
            <br/><br/>
            <div>
              <div class="operator">
                <a-button class="ned" @click="addNew" type="primary"><a-icon type="plus" />新建</a-button>
                <a-button class="ned" @click="deleteNews" type="danger"><a-icon type="delete" />删除</a-button>
              </div>
              <standard-table
                      :columns="columns"
                      :data-source="dataSourcelist"
                      :selectedRows.sync="selectedRows"
                      rowKey="userId"
                      :pagination="{onChange:(page) =>pageChange(page),onShowSizeChange:(current,size) =>pagesizeChange(current,size),showTotal:total => `总共 ${total} 条`,pageSize:pageSize,showSizeChanger:true,total:count}"
                      @clear="onClear"
              >
                <div slot="status">
                  <a-switch default-checked @change="onChangeStaus" />
                </div>
                <div slot="action" slot-scope="{text,record}">
                  <a-button type="link" @click="editNew(record)" >
                    <a-icon type="edit" />修改
                  </a-button>
                  <a-button type="link"  @click="deleteNew(record)">
                    <a-icon type="delete"/>删除
                  </a-button>
                  <a-button type="link" @click="showNewPass(record)">
                    <a-icon type="rest" />重置
                  </a-button>
                </div>
              </standard-table>
              <!--Newpassword模块-->
              <div>
                 <new-pass v-model="newpasswordvisible" :form="upDatepass"   @success="pwdSuccess" />
              </div>
              <!--新建用户模块-->
              <div>
                <new-user :roles="rolesdata" :depts="deptsdata" v-model="adduservisible" @success="createSuccess"/>
              </div>
              <!--修改用户模块-->
              <div>
                <edit-user :roles="rolesdata" :depts="deptsdata"  :user="editUser" v-model="edituservisible"  @success="editSuccess "/>
              </div>
            </div>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>
<script>
import StandardTable from '@/components/table/StandardTable'
import NewUser from "@/pages/system/users/NewUser"
import EditUser from "@/pages/system/users/EditUser";
import NewPass from "@/pages/system/users/NewPass";
import {princeuserlist, deleteprinceuser,updatepwd, rolelist, deptTree, createprinceuser} from '@/services'
import moment from 'moment'
// import {mapState} from "vuex";
const columns = [
  {
    title: '编号',
    dataIndex: 'userId'
  },
  {
    title: '用户名称',
    dataIndex: 'username',
    align: "center"
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    align: "center"
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    align: "center"
  },
  {
    title: '手机号',
    dataIndex: 'phone',
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
    NewUser,
    EditUser,
    NewPass,
  },
  data () {

    return {
      editUser:{},
      upDatepass:{},
      loading: false,
      newpasswordvisible: false,
      adduservisible: false,
      edituservisible: false,
      columns: columns,
      dataSourcelist: [],
      selectedRows: [],
      pageSize: 10,
      count: 0,
      pageIndex: 1,
      userSearchForm: {
        userName: undefined,
        phone: undefined,
        status: undefined,
      },
      rolesdata: [],
      deptsdata: [],
    }
  },
  mounted() {
    this.princeUserList()
    this.deptTree()
    this.roleList()
  },

  methods: {
    //获取用户列表
    princeUserList(pageIndex = this.pageIndex, pageSize = this.pageSize, userName = this.userSearchForm.userName, phone = this.userSearchForm.phone, status=this.userSearchForm.status){
      princeuserlist(pageIndex,pageSize,userName,phone,status).then(res =>{
        this.dataSourcelist = res.data.data.list
        this.count = res.data.data.count
        this.pageSize = res.data.data.pageSize
        this.pageIndex = res.data.data.pageIndex
        this.userName = res.data.data.list.userName
        this.phone = res.data.data.list.phone
        this.status = res.data.data.list.status
        console.log(this.dataSourcelist)
      })
    },
    //获取分页
    pageChange(page) {
      this.princeUserList(page)
    },
    pagesizeChange(current,size) {
      this.princeUserList(current,size)
    },
    //搜索
    userSearch(){
      this.princeUserList()

    },
    resetSearch() {
      this.$refs.formSearch.resetFields()
    },

    //获取角色列表
    roleList(){
      rolelist().then(res =>{
        this.rolesdata = res.data.data.list
      })
    },
    //获取部门列表
    deptTree(){
      deptTree().then(res =>{
        this.deptsdata = res.data.data
      })
    },
    //重置密码
    showNewPass(record) {
      this.newpasswordvisible = true;
      record.password=''
      this.upDatepass = record;

    },
    newpasshandleOk(e) {
        this.newpasswordvisible = false;
    },
    pwdSuccess(){
      this.princeUserList()
    },
    newpasshandleCancel(e) {
      this.newpasswordvisible = false;
    },
    //新建用户
    addNew() {
      this.adduservisible = true;
    },
    createSuccess(){
      this.princeUserList()
    },
    //修改用户
    editNew(record) {
      this.edituservisible = true;
      record.password=''
      this.editUser = record;
    },
    editSuccess(){
      this.princeUserList()
    },
    //删除用户
    deleteNew(record){
      const _this = this
      this.$confirm({
        title: '警告',
        content: '是否确认删除此用户?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          deleteprinceuser(record).then(_this.afterDeleteUser)
        },
        onCancel() {},
      });
    },
    afterDeleteUser(res){
      const result = res.data
      if(result.code === 200){
        this.princeUserList()
        this.$message.success(result.msg, 3)
      }else {
        this.princeUserList()
        this.$message.error(result.msg, 3)
      }
    },
    deleteNews(){
      const _this = this
      const userIds=[]
      this.selectedRows.forEach(c =>userIds.push({"userId": c.userId }) )
      this.$confirm({
        title: '警告',
        content: '是否确认删除选中的用户?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          userIds.forEach(c =>deleteprinceuser(c).then(_this.afterDeleteUser))
        },
        onCancel() {},
      });
      console.log(userIds)
    },
    //搜索用户功能


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
  .user-left{
    .content{
      border: 1px solid @border-color-split;
      border-radius: 4px;
      margin-right: 8px;
      background-color: @base-bg-color;
    }
    .search-left{
      text-align: center;
      .search-left-child{
        margin-top: 16px;
        width: 100px;
      }
    }
  }
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
  .phone{
    margin-left:10px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
