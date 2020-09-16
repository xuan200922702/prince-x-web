<template>
    <a-modal  v-model="show" :width="700" title="添加菜单">
        <template slot="footer">
            <a-button key="back" @click="cancel" >
                取消
            </a-button>
            <a-button style="margin-left: 10px;" @click="reset">
                重置
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="createDept">
                创建
            </a-button>

        </template>
        <a-form-model  ref="form"  :rules="rules" :model="dept"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <div>
                <a-row>
                    <a-col :span="12">
                        <a-form-model-item   ref="deptName"  prop="deptName"  label="部门名称">
                            <a-input  v-model="dept.deptName" />
                        </a-form-model-item>
                        <a-form-model-item ref="leader"  prop="leader"   label="负责人">
                            <a-input v-model="dept.leader" />
                        </a-form-model-item>
                        <a-form-model-item  ref="email"  prop="email"  label="邮箱">
                            <a-input v-model="dept.email" />
                        </a-form-model-item>
                        <a-form-model-item  label="状态">
                            <a-switch :checked="dept.status === '0'" @change="val => dept.status = val ? '0' : '1'" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item  ref="phone"  prop="phone"  label="手机号">
                            <a-input v-model="dept.phone" />
                        </a-form-model-item>
                        <a-form-model-item ref="parentId"  prop="parentId"  label="所属上级部门">
                            <a-tree-select
                                    v-model="dept.parentId"
                                    style="width: 100%"
                                    ref="parentId"
                                    prop="parentId"
                                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                                    :tree-data="depts"
                                    placeholder="请选择上级部门"
                                    tree-default-expand-all
                                    :replaceFields="{children:'children', title:'deptName', key:'deptId', value: 'deptId'}"
                            >

                            </a-tree-select>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </div>
        </a-form-model>
    </a-modal>
</template>d

<script>
    import {createprincedept} from "@/services"
    export default {
        name: "NewDept",
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            depts: Array,
            visible: Boolean
        },
        data() {
            return {
                expandedKeys: ['0-0-0', '0-0-1'],
                autoExpandParent: true,
                checkedKeys: ['0-0-0'],
                selectedKeys: [],
                dept: {
                    deptName: undefined,
                    leader: undefined,
                    email: undefined,
                    phone: undefined,
                    parentId: undefined,
                    status: "0",

                },
                loading: false,
                rules: {
                    deptName: [
                        { required: true, message: '请输入部门名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
                    ],
                    leader: [
                        { required: true, message: '请输入负责人', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                        { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' },
                    ],
                    parentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
                    email:[
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: "请输入正确的邮箱地址",trigger: 'blur' },
                    ],
                }
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
        watch: {
            checkedKeys(val) {
                console.log('onCheck', val);
            }
        },
        methods: {
            createDept() {
                this.loading = true;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        createprincedept(this.dept).then(res => {
                            this.afterCreateDept(res)
                            this.loading = false
                        })
                    } else {
                        this.loading =  false
                        this.$message.error("请输入完整信息", 3)
                        return false;
                    }
                });
            },
            afterCreateDept(res){
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
            onCheck(checkedKeys) {
                console.log('onCheck', checkedKeys);
                this.checkedKeys = checkedKeys;
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