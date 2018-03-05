<template>
	<div>
    <Button type='primary' @click="addShow('formAdd')">新增管理员</Button>
    <i-table :columns="columns1" :data="data1"></i-table>	
  <Modal title="新增" :loading="loading" v-model="modalAdd"  @on-ok="doAdd('formAdd')" :mask-closable="false">
        <i-form ref="formAdd" :label-width="100" :rules="ruleAdd" :model="formAdd">
            <Form-item label="登录名" prop="username">
                <Input v-model="formAdd.username"></Input>
            </Form-item>
            <Form-item label="密码" prop="password">
                <Input type="password" v-model="formAdd.password">
                </Input>
            </Form-item>
        </i-form>
    </Modal>
	</div>
</template>
<script>
import Vue from 'vue'
import api from '../utils/api'
import axios from 'axios'
import iviewArea from 'iview-area'
Vue.use(iviewArea)
export default {
  data () {
    return {
      loading: true,
      modalAdd: false,
      formAdd: {
        username: '',
        password: ''
      },
      ruleAdd: {
        username: [
              { required: true, type: 'string', message: '登录名不能为空', trigger: 'blur' }
        ],
        password: [
              { required: true, message: '密码不能为空', trigger: 'blur' },
              { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      },
      columns1: [
        {
          title: 'ID',
          key: 'admin_id'
        },
        {
          title: '用户账号',
          key: 'username'
        },
        {
          title: '最后登录时间',
          key: 'lasttime'
        }
      ],
      data1: []
    }
  },
  methods: {
    addShow (name) {
      this.modalAdd = true
    },
    doAdd (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let postData = {}
          postData = JSON.parse(JSON.stringify(this.formAdd))
          axios.post(api.useradd, postData)
          .then((res) => {
            if (res.data.status === 1) {
              this.$Message.success(res.data.message)
              this.modalAdd = false
              this.getUserList()
            } else {
              this.$Message.error(res.data.message)
              this.loading = false
              this.$nextTick(() => {
                this.loading = true
              })
            }
          }, (err) => {
            console.log(err)
          })
        } else {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
          this.$Message.error('验证失败!')
        }
      })
    },
    getUserList () {
      axios.post(api.getuserlist).then((res) => {
        this.data1 = res.data.data
      }, (err) => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>