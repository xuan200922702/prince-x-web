<template>
    <a-modal v-model="visible"  title="请输入用户的新密码" >
        <template slot="footer">
            <a-button key="back" @click="cancel" >
                取消
            </a-button>
            <a-button  @click="reset">
                重置
            </a-button>
            <a-button key="submit" type="primary" :loading="loading" @click="updatePass">
                确定
            </a-button>
        </template>
        <template>
            <a-form-model class="newpassword" ref="form" :model="form" :rules="rules" v-bind="layout">
                <a-form-model-item has-feedback label="新的密码" prop="password">
                    <a-input v-model="form.password" type="password" autocomplete="off" />
                </a-form-model-item>
                <a-form-model-item has-feedback label="确认新的密码" prop="checkPass">
                    <a-input v-model="form.checkPass" type="password" autocomplete="off" />
                </a-form-model-item>
            </a-form-model>
        </template>
    </a-modal>
</template>

<script>
    import {updateprinceuser} from "@/services";

    export default {
        name: "NewPass",
        model: {
            prop: 'visible',
            event: 'change',
        },
        props: {
            form: {},
            visible: Boolean
        },
        data(){
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新的密码'));
                } else {
                    if (this.form.checkPass) {
                        this.$refs.form.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请再次输入新的密码'));
                } else if (value !== this.form.password ) {
                    callback(new Error("两次输入不一致!"));
                } else {
                    callback();
                }
            };
            return{
                loading: false,
                rules: {
                    password: [{ validator: validatePass, trigger: 'change' }],
                    checkPass: [{ validator: validatePass2, trigger: 'change' }],
                },
                layout: {
                    labelCol: { span: 6},
                    wrapperCol: { span: 14 },
                },
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
            updatePass() {
                this.loading = true;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        updateprinceuser(this.form).then(res => {
                            this.afterUpdateUser(res)
                            this.loading = false
                        })
                    } else {
                        this.loading =  false
                        this.$message.error("请输入新密码", 3)
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
                    this.$refs.form.clearValidate()
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