<script>
  import NewMenu from "@/pages/system/menus/NewMenu";
  export default {
    components: { NewMenu}
  }
</script>
<template>
  <a-card>
    <div >
      <a-form-model    ref="formSearch"  :model="menuSearchForm"   layout="horizontal"  >
        <div>
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-model-item
                      label="菜单名称"
                      :labelCol="{span: 5}"
                      :wrapperCol="{span: 18, offset: 1}"
                      ref="menuName"  prop="menuName"
              >
                <a-input v-model="menuSearchForm.menuName"
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
                <a-select v-model="menuSearchForm.status"  placeholder="请选择状态">
                  <a-select-option value="0">启用</a-select-option>
                  <a-select-option value="1">禁用</a-select-option>
                </a-select>
              </a-form-model-item >
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
                <a-button type="primary"  @click="menuSearch"><a-icon type="search" />查询</a-button>
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
              rowKey="menuId"
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
          <a-button type="link">
            <a-icon type="rest" />重置
          </a-button>
        </div>
      </standard-table>
      <!--新建菜单模块-->
      <div>
        <new-menu  :menus="menusdata" v-model="addrolevisible"  />
      </div>
      <!--修改菜单模块-->
      <div>
      </div>
    </div>
  </a-card>
</template>
<script>
  import  StandardTable from '@/components/table/StandardTable'
  import NewMenu from  '@/pages/system/menus/NewMenu'
  import EditMenu from "@/pages/system/menus/EditMenu";

  import {princemenulist,deleteprincerole} from '@/services'
  import moment from 'moment'
  // import {mapState} from "vuex";
  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      align: "center"
    },
    {
      title: '菜单状态',
      dataIndex: 'visible',
      key: 'visible',
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
      NewMenu,
      EditMenu,
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
        menuSearchForm: {
          title: undefined,
          visible: undefined,
        },
        menusdata: [],
      }
    },
    mounted() {
      this.princeMenuList()

    },

    methods: {
      //获取菜单列表
      princeMenuList(title = this.menuSearchForm.title, visible=this.menuSearchForm.visible){
        princemenulist(title,visible).then(res =>{
          this.dataSourcelist = res.data.data
          this.formatMenuTree(this.dataSourcelist)
          this.title = res.data.data.title
          this.visible = res.data.data.visible
          console.log(this.dataSourcelist)
        })
      },
      /**
       * 格式化菜单数据，清除没有子数据的 children 属性
       * @param treeData 菜单数据
       */
      formatMenuTree(treeData) {
        treeData.forEach(item => {
          if (item.children) {
            if  (item.children.length === 0) {
              delete item.children
            } else {
              this.formatMenuTree(item.children)
            }
          }
        })
      },
      //搜索
      menuSearch(){
        this.princeMenuList()
      },
      resetSearch() {
        this.$refs.formSearch.resetFields()
      },

      //新建菜单
      addRole() {
        this.addrolevisible = true
      },
      createSuccess(){
        this.princeMenuList()
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
  .roleKey{
    margin-left:10px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
