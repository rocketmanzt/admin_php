<template>
<div>
      <i-form   ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
        <Form-item label="商品名" prop="name">
            <i-input v-model="formItem.name" placeholder="请输入" ></i-input>
        </Form-item>
        <Form-item label="商品类型" prop="type">
            <i-select v-model="formItem.type" placeholder="请选择">
                <i-option value="小吃">小吃</i-option>
                <i-option value="水果">水果</i-option>
                <i-option value="甜品">甜品</i-option>
            </i-select>
        </Form-item>
          <Form-item label="上传时间" >
            <Row>
                <i-col span="11">
                  <Form-item prop="creat_time">
                    <Date-picker placeholder="选择日期" v-model="formItem.creat_time"></Date-picker>
                  </Form-item>  
                </i-col>
            </Row>
        </Form-item>
        <Form-item label="介绍" prop="introduce">
            <i-input v-model="formItem.introduce" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
        </Form-item>
        <Form-item>
          <span  type="primary">飒飒</span>
            <i-button type="primary" @click="handleSubmit('formItem')" :disabled="disabled">提交</i-button>
            <i-button type="ghost" @click="go()" style="margin-left: 8px">提交1</i-button>
            <i-button type="ghost" style="margin-left: 8px">取消</i-button>
        </Form-item>
    </i-form>
</div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      ruleValidate: {
        name: [
       {required: true, message: '商品名不能为空', trigger: 'blur'}
        ],
        type: [
        { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        creat_time: [
        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        introduce: [
        { required: true, message: '请输入商品介绍', trigger: 'blur' },
        { type: 'string', min: 5, message: '商品介绍不能少于5字', trigger: 'blur' }
        ],
        radio: [
        { required: true, message: '请选择性别', trigger: 'change' }
        ]
      },
      disabled: true,
      imgName: '',
      visible: false,
      uploadList: [],
      curImageSrc: '',
      formItem: {
        name: '',
        creat_time: '',
        type: '',
        introduce: ''
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let postData = {}
          postData = JSON.parse(JSON.stringify(this.formItem))
          axios.post('api/index.php?m=home&c=product&a=check', postData)
          .then((res) => {
            if (res.data.status === 1) {
              this.$Message.success('添加成功!')
            } else {
              this.$Message.error('添加失败!')
            }
          }, (err) => {
            console.log(err)
          })
        }
      })
    },
    tt () {
      console.log(this.formItem.select)
    },
    handleView (name, url) {
      this.imgName = name
      this.visible = true
      this.curImageSrc = url
      console.log(this.imgName)
    },
    handleRemove (file) {
            // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
      file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      file.name = '7eb99afb9d5f317c912f08b5212fd69a'
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      })
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 5
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 5 张图片。'
        })
      }
      return check
    }
  }
}
</script>
<style>
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>





