<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import api from '../utils/api'
import axios from 'axios'
import Cookies from 'js-cookie'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      isShow: true,
      form: {
        userName: '',
        password: ''
      },
      rules: {
        userName: [
                { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations({
      setUsers: 'SET_USERS'
    }),
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          Cookies.set('user', this.form.userName)
          Cookies.set('password', this.form.password)
          let postData = {}
          postData.username = this.form.userName
          postData.password = this.form.password
          axios.post(api.login, postData).then((res) => {
            if (res.data.status === 1) {
              Cookies.set('access', '1', { expires: 1 / 1440 })
              this.setUsers(res.data.data)
              this.$Notice.success({
                desc: res.data.message
              })
              this.$router.push({
                name: 'index'
              })
            } else {
              this.$Notice.warning({
                desc: res.data.message
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style  lang="less">
    @import '../styles/login.less';
    @import '../styles/main.less';
</style>
