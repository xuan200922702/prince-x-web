<template>
    <a-modal  v-model="show" :width="550" title="添加菜单">
        <template slot="footer">
            <a-button key="back" @click="cancel" >
                取消
            </a-button>
            <a-button style="margin-left: 10px;" @click="reset">
                重置
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="createMenu">
                创建
            </a-button>

        </template>
        <a-form-model  ref="form"  :rules="rules" :model="menu"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <div>
                        <a-form-model-item   ref="title"  prop="title"  label="角色名称">
                            <a-input  v-model="menu.title" />
                        </a-form-model-item>
                        <a-form-model-item  label="状态">
                            <a-switch :checked="menu.visible === '0'" @change="val => menu.visible = val ? '0' : '1'" />
                        </a-form-model-item>
                <a-form-model-item  label="菜单权限">
                    <template>
                        <a-tree
                                v-model="checkedKeys"
                                checkable
                                :expanded-keys="expandedKeys"
                                :auto-expand-parent="autoExpandParent"
                                :selected-keys="selectedKeys"
                                :tree-data="menus"
                                @expand="onExpand"
                                @select="onSelect"
                        />
                    </template>
                </a-form-model-item>

            </div>
        </a-form-model>
    </a-modal>
</template>d

<script>
    import {createprinceuser} from "@/services"
    export default {
        name: "NewMenu",
        model: {
            prop: 'visible',
            event: 'change'
        },
        props: {
            menus: Array,
            depts: Array,
            visible: Boolean
        },
        data() {
            return {
                expandedKeys: ['0-0-0', '0-0-1'],
                autoExpandParent: true,
                checkedKeys: ['0-0-0'],
                selectedKeys: [],
                menu: {
                    title: undefined,
                    visible: "0",

                },
                loading: false,
                rules: {
                    title: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' },
                        { min: 3, max: 20, message: '长度应该为大于3小于20', trigger: 'blur' },
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
            createMenu() {
                this.loading = true;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        createprinceuser(this.menu).then(res => {
                            this.afterCreateMenu(res)
                            this.loading = false
                        })
                    } else {
                        this.loading =  false
                        this.$message.error("请输入完整信息", 3)
                        return false;
                    }
                });
            },
            afterCreateMenu(res){
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