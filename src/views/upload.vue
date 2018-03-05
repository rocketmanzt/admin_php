<template>
<div>
      <i-form   ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
        <Form-item label="商品名" prop="product_name">
            <i-input v-model="formItem.product_name" placeholder="请输入" ></i-input>
        </Form-item>
        <Form-item label="商品类型" prop="product_type">
            <i-select v-model="formItem.product_type" placeholder="请选择">
                <i-option value="小吃">小吃</i-option>
                <i-option value="水果">水果</i-option>
                <i-option value="甜品">甜品</i-option>
            </i-select>
        </Form-item>
        <Form-item label="上传时间" >
            <Row>
                <i-col span="11">
                  <Form-item prop="create_time">
                    <Date-picker placeholder="选择日期" v-model="formItem.create_time"></Date-picker>
                  </Form-item>  
                </i-col>
            </Row>
        </Form-item>
        <Form-item label="介绍" prop="product_introduct">
            <i-input v-model="formItem.product_introduct" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></i-input>
        </Form-item>
        <Form-item label="图片上传">
       <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                    <i class="ivu-icon ivu-icon-ios-eye-outline" @click="handleView(item.name,item.url)"></i>
                    <i class="ivu-icon ivu-icon-ios-trash-outline" @click="handleRemove(item)"></i >
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="api.uploadaction"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="查看图片" v-model="visible">
            <img :src="curImageSrc" v-if="visible" style="width: 100%">
        </Modal>
        </Form-item>  
        <Form-item>
            <i-button type="primary" @click="handleSubmit('formItem')">提交</i-button>
            <i-button type="ghost" style="margin-left: 8px">取消</i-button>
        </Form-item>
    </i-form>
</div>
</template>
<script>
import api from '../utils/api'
import axios from 'axios'
export default {
  data () {
    return {
      ruleValidate: {
        product_name: [
       {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        product_type: [
        { required: true, message: '请选择商品类型', trigger: 'blur' }
        ],
        create_time: [
        { required: true, type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        product_introduct: [
        { required: true, message: '请输入商品介绍', trigger: 'blur' },
        { type: 'string', min: 5, message: '商品介绍不能少于5字', trigger: 'blur' }
        ]
      },
      api,
      imgName: '',
      visible: false,
      uploadList: [],
      curImageSrc: '',
      formItem: {
        product_name: '',
        product_type: '',
        create_time: '',
        product_introduct: ''
      }
    }
  },
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(valid)
          let postData = {}
          postData = JSON.parse(JSON.stringify(this.formItem))
          postData.itemImage = []
          this.uploadList.forEach((v) => {
            const obj = {
              imgUrl: v.url,
              imgUid: v.uid
            }
            postData.itemImage.push(obj)
          })
          if (this.uploadList.length === 0) {
            this.$Modal.warning({
              content: '请上传至少一张图片'
            })
            return
          }
          axios.post(api.bannerimagesubmit, postData)
          .then((res) => {
            this.$Message.success('添加商品成功!')
            this.data1 = res.data
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
    },
    handleRemove (file) {
            // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
      file.url = res.data
      console.log(res.data)
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
      const check = this.uploadList.length < 6
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 5 张图片。'
        })
      }
      return check
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    console.log(this.uploadList)
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





