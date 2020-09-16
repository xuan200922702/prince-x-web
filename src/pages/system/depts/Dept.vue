<script>
  import NewDept from "@/pages/system/depts/NewDept";
  export default {
    components: { NewDept}
  }
</script>
<template>
  <a-card>
    <div >
      <a-form-model    ref="formSearch"  :model="deptSearchForm"   layout="horizontal"  >
        <div>
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-model-item
                      label="菜单名称"
                      :labelCol="{span: 5}"
                      :wrapperCol="{span: 18, offset: 1}"
                      ref="deptName"  prop="deptName"
              >
                <a-input v-model="deptSearchForm.deptName"
                         placeholder="请输入菜单名称" />
              </a-form-model-item >
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-model-item
                      label="状态"
                      :labelCol="{span: 5}"
                      :wrapperCol="{span: 18, offset: 1}"
                      ref="status"  prop="status"
              >
                <a-select v-model="deptSearchForm.status"  placeholder="请选择状态">
                  <a-select-option value="0">启用</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
              </a-form-model-item >
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
                <a-button type="primary"  @click="deptSearch"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 10px" @click="resetSearch" ><a-icon type="rest" />重置</a-button>
                </span>
      </a-form-model>
    </div>
    <br/><br/>
    <div>
      <div class="operator">
        <a-button class="ned" @click="addRole" type="primary"><a-icon type="plus" />新建</a-button>
      </div>
      <standard-table
              :columns="columns"
              :data-source="dataSourcelist"
              :selectedRows.sync="selectedRows"
              rowKey="deptId"
              @clear="onClear"
      >
        <div slot="status">
          <a-switch default-checked @change="onChangeStaus" />
        </div>
        <div slot="action" >
          <a-button type="link"  >
            <a-icon type="edit" />修改
          </a-button>
          <a-button type="link" >
            <a-icon type="delete"/>删除
          </a-button>
        </div>
      </standard-table>
      <!--新建部门模块-->
      <div>
        <new-dept  :depts="dataSourcelist" v-model="addrolevisible"   @success="createSuccess" />
      </div>
      <!--修改菜单模块-->
      <div>
      </div>
    </div>
  </a-card>
</template>
<script>
  import  StandardTable from '@/components/table/StandardTable'
  import NewDept from  '@/pages/system/depts/NewDept'
  import EditDept from "@/pages/system/depts/EditDept";

  import {princedeptlist,deleteprincerole} from '@/services'
  import moment from 'moment'
  // import {mapState} from "vuex";
  const columns = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      align: "center"
    },
    {
      title: '部门状态',
      dataIndex: 'status',
      key: 'status',
      align: "center"
    },
    {
      title: '操作',
      key: 'action',
      align: "center",
      scopedSlots: { customRender: 'action' }
    },
  ];

  export default {
    name: 'QueryList',
    components: {
      StandardTable,
      NewDept,
      EditDept,
    },
    data () {
      return {
        columns,
        dataSourcelist:[],
        editUser:{},
        upDatepass:{},
        loading: false,
        newpasswordvisible: false,
        addrolevisible: false,
        edituservisible: false,

        selectedRows: [],
        pageSize: 10,
        count: 0,
        pageIndex: 1,
        deptSearchForm: {
          title: undefined,
          visible: undefined,
        },
        deptsdata: [],
      }
    },
    mounted() {
      this.princeDeptList()

    },

    methods: {
      //获取菜单列表
      princeDeptList(title = this.deptSearchForm.title, visible=this.deptSearchForm.visible){
        princedeptlist(title,visible).then(res =>{
          this.dataSourcelist = res.data.data
          this.formatDeptTree(this.dataSourcelist)
          this.title = res.data.data.title
          this.visible = res.data.data.visible
          console.log(this.dataSourcelist)
        })
      },
      /**
       * 格式化菜单数据，清除没有子数据的 children 属性
       * @param treeData 菜单数据
       */
      formatDeptTree(treeData) {
        treeData.forEach(item => {
          if (item.children) {
            if  (item.children.length === 0) {
              delete item.children
            } else {
              this.formatDeptTree(item.children)
            }
          }
        })
      },
      //搜索
      deptSearch(){
        this.princeDeptList()
      },
      resetSearch() {
        this.$refs.formSearch.resetFields()
      },

      //新建菜单
      addRole() {
        this.addrolevisible = true
      },
      createSuccess(){
        this.princeDeptList()
      },
      //修改菜单
      editNew(record) {
        this.edituservisible = true;
        record.password=''
        this.editUser = record;
      },
      editSuccess(){
        this.princeUserList()
      },
      //删除菜单
      deleteRole(record){
        const _this = this
        this.$confirm({
          title: '警告',
          content: '是否确认删除此菜单?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
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
          content: '是否确认删除选中的菜单?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            userIds.forEach(c =>deleteprincerole(c).then(_this.afterDeleteRole))
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
      handleDeptClick (e) {
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
  .roleKey{
    margin-left:10px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
