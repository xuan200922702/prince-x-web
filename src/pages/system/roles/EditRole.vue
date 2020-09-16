<template>
    <a-modal v-model="show"   :width="700" title="修改用户" >
        <template slot="footer">
            <a-button key="back" @click="cancel" >
                取消
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="editRole">
                修改
            </a-button>

        </template>
        <template>
            <a-form-model  ref="form"  :rules="rules" :model="role" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <div>
                    <a-form-model-item   ref="roleName"  prop="roleName"  label="角色名称">
                        <a-input  v-model="role.roleName" />
                    </a-form-model-item>
                    <a-form-model-item ref="roleKey"  prop="roleKey"   label="权限字符">
                        <a-input v-model="role.roleKey" />
                    </a-form-model-item>
                    <a-form-model-item  label="状态">
                        <a-switch :checked="role.status === '0'" @change="val => role.status = val ? '0' : '1'" />
                    </a-form-model-item>
                    <a-form-model-item  label="菜单权限">
                        <template>
                            <a-tree
                                    v-model="role.menuIds"
                                    checkable
                                    :expanded-keys="expandedKeys"
                                    :auto-expand-parent="autoExpandParent"
                                    :selected-keys="selectedKeys"
                                    :replaceFields="{children:'children', title:'title', key:'menuId', value: 'menuId'}"
                                    :tree-data="menus"
                                    :defaultExpandAll="defaultExpandAll"
                                    @expand="onExpand"
                                    @select="onSelect"
                                    ref="menuIds" prop="menuIds"
                            />
                        </template>
                    </a-form-model-item>
                </div>
            </a-form-model>
        </template>
    </a-modal>
</template>

<script>
    import {updateprincerole} from "@/services"
    export default {
        name: "EditRole",
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            depts: Array,
            menus: Array,
            role: {},
            visible: Boolean,
            defaultExpandAll: Boolean
        },
        data(){
          return{
              autoExpandParent: true,
              expandedKeys: [],
              selectedKeys: [],
              rules: {
                  roleName: [
                      { required: true, message: '请输入角色名称', trigger: 'blur' },
                      { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
                  ],
                  roleKey: [
                      { required: true, message: '请输入权限字符', trigger: 'blur' },
                      { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
                  ],

              },
              loading: false,
          }
        },
        computed: {
            show: {
                get() {
                    return this.visible
                },
                set(val) {
                    this.$emit('change', val)
                }
            }
        },
        methods: {
            editRole() {
                this.loading = true;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        updateprincerole(this.role).then(res => {
                            this.afterUpdateRole(res)
                            this.loading = false
                        })
                    } else {
                        this.loading =  false
                        this.$message.error("请输入完整信息", 3)
                        return false;
                    }
                });
            },
            afterUpdateRole(res){
                const result = res.data
                if(result.code === 200){
                    this.show = false;
                    this.$message.success(result.msg, 3)
                    this.$emit('success', res)
                }else {
                    this.$message.error(result.msg, 3)
                }
            },
            reset() {
                this.$refs.form.resetFields()
            },
            cancel() {
                this.reset()
                this.show = false
            },
            onExpand(expandedKeys) {
                console.log('onExpand', expandedKeys);
                // if not set autoExpandParent to false, if children expanded, parent can not collapse.
                // or, you can remove all expanded children keys.
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },

            onSelect(selectedKeys, info) {
                console.log('onSelect', info);
                this.selectedKeys = selectedKeys;
            },
        }

    }

</script>

<style scoped>

</style>