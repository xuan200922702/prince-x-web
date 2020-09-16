<template>
    <a-modal v-model="show"   :width="700" title="修改用户" >
        <template slot="footer">
            <a-button key="back" @click="cancel" >
                取消
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="editUser">
                修改
            </a-button>

        </template>
        <template>
            <a-form-model  ref="form"  :rules="rules" :model="user" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
                <div>
                    <a-row>
                        <a-col :span="12">
                            <a-form-model-item   ref="username"  prop="username"  label="用户名">
                                <a-input  v-model="user.username" />
                            </a-form-model-item>
                            <a-form-model-item ref="phone"  prop="phone"   label="手机号">
                                <a-input v-model="user.phone" />
                            </a-form-model-item>
                            <a-form-model-item  ref="email"  prop="email"  label="邮箱">
                                <a-input v-model="user.email" />
                            </a-form-model-item>
                            <a-form-model-item prop="checked"  label="状态">
                                <a-switch :checked="user.status === '0'" @change="val => editUser.status = val ? '0' : '1'"/>
                            </a-form-model-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-model-item  ref="nickName"  prop="nickName"  label="用户昵称">
                                <a-input v-model="user.nickName" />
                            </a-form-model-item>
                            <a-form-model-item ref="deptId"  prop="deptId"  label="所属部门">
                                <a-tree-select
                                        v-model="user.deptId"
                                        style="width: 100%"
                                        ref="deptId"
                                        prop="deptId"
                                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                        :tree-data="depts"
                                        placeholder="请选择部门"
                                        tree-default-expand-all
                                        :replaceFields="{children:'children', title:'deptName', key:'deptId', value: 'deptId'}"
                                >

                                </a-tree-select>
                            </a-form-model-item>
                            <a-form-model-item ref="roleId"  prop="roleId"  label="用户角色">
                                <a-select v-model="user.roleId"   placeholder="请选择角色">
                                    <a-select-option v-for="role in roles" :value="role.roleId" :key="role.roleId">
                                        {{role.roleName}}
                                    </a-select-option>
                                </a-select>
                            </a-form-model-item>
                            <a-form-model-item ref="sex"  prop="sex"   label="用户性别">
                                <a-radio-group v-model="user.sex">
                                    <a-radio value="1">
                                        男
                                    </a-radio>
                                    <a-radio value="2">
                                        女
                                    </a-radio>
                                </a-radio-group>
                            </a-form-model-item>
                        </a-col>
                    </a-row>
                </div>
            </a-form-model>
        </template>
    </a-modal>
</template>

<script>
    import {updateprinceuser} from "@/services"
    export default {
        name: "EditMenu",
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            roles: Array,
            depts: Array,
            user: {},
            visible: Boolean
        },
        data(){
          return{
              rules: {
                  username: [
                      { required: true, message: '请输入用户名称', trigger: 'blur' },
                      { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
                  ],
                  password: [
                      { required: true, message: '请输入用户密码', trigger: 'blur' },
                      { min: 6, max: 20, message: '长度应该为大于6小于20', trigger: 'blur' },
                  ],
                  nickName: [
                      { required: true, message: '请输入用户昵称', trigger: 'blur' },
                      { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
                  ],
                  phone: [
                      { required: true, message: '请输入手机号', trigger: 'blur' },
                      { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
                  ],
                  dept: [{ required: true, message: '请选择部门', trigger: 'change' }],
                  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
                  email:[
                      { required: true, message: '请输入邮箱', trigger: 'blur' },
                      { type: 'email', message: "这不是一个邮箱",trigger: 'blur' },
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
                        updateprinceuser(this.user).then(res => {
                            this.afterUpdateUser(res)
                            this.loading = false
                        })
                    } else {
                        this.loading =  false
                        this.$message.error("请输入完整信息", 3)
                        return false;
                    }
                });
            },
            afterUpdateUser(res){
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
            }
        }

    }

</script>

<style scoped>

</style>