<template>
	<div>
       <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载页面中...</div>
        </Spin>
    <Button type='primary' @click="addShow('formAdd')">新增banner图</Button>
    <i-table  size="small"  :columns="columns1" :data="data"></i-table>
    <br/>
     <Page :total="dataCount" :page-size="pageSize" show-total @on-change="changePage"></Page> 
   
       <Modal title="编辑" v-model="modalEdit" @on-ok="editSave('formEdit')" :loading="loading" :mask-closable="false">
            <Form ref="formEdit" :label-width="80" :model="formEdit" :rules="ruleAdd">
                <Form-item label="名称" prop="name">
                    <Input v-model="formEdit.name"></Input>
                </Form-item>
                <Form-item label="排序" prop="rank">
                    <Input v-model.number="formEdit.rank">
                    </Input>
                </Form-item>
                <Form-item label="链接" prop="url">
                    <Input v-model="formEdit.url"></Input>
                </Form-item>
                  <Form-item label="图片上传" >
                    <div class='demo-upload-list' v-if="formEdit.img_url">
                        <img :src="formEdit.img_url">
          </div>
        <Upload
            ref="upload"
            :show-upload-list="false"
            :on-success="previewAdd"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload"
            multiple
            type="drag"
            :action="api.bannerimage"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
                </Form-item>
            </Form>
        </Modal>

    <Modal title="新增" :loading="loading" v-model="modalAdd"  @on-ok="doAdd('formAdd')" :mask-closable="false">
        <i-form ref="formAdd" :label-width="100" :rules="ruleAdd" :model="formAdd">
            <Form-item label="名称" prop="name">
                <Input v-model="formAdd.name"></Input>
            </Form-item>
            <Form-item label="排序" prop="rank">
                <Input v-model.number="formAdd.rank">
                </Input>
            </Form-item>
            <Form-item label="链接" prop="url">
                <Input v-model="formAdd.url"></Input>
            </Form-item>
        <Form-item label="图片上传" >
       <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
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
            :action="api.bannerimage"
            style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        </Form-item>
        </i-form>
    </Modal>
    </div>
</template>
<script>
import api from '../utils/api'
import axios from 'axios'
export default {
  data () {
    return {
      pageSize: 10,
      dataCount: 0,
      loading: true,
      spinShow: true,
      modalAdd: false,
      modalEdit: false,
      data: [],
      formAdd: {
        name: '',
        rank: '',
        url: ''
      },
      formEdit: {
        name: '',
        rank: '',
        url: ''
      },
      ruleAdd: {
        name: [
              { required: true, type: 'string', message: '名称不能为空', trigger: 'blur' }
        ],
        rank: [
              { required: true, type: 'number', message: '排序应为整数', trigger: 'blur' }
        ],
        url: [
              { required: true, message: '链接不能为空', trigger: 'blur' }
        ]
      },
      columns1: [
        {
          type: 'index'
        },
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '排序',
          key: 'rank'
        },
        {
          title: 'banner名称',
          key: 'name'
        },
        {
          title: '链接地址',
          key: 'url'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          key: 'action',
          render: (h, params) =>
            h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editShow(params.index, 'formEdit')
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteShow(params.index)
                  }
                }
              }, '删除')
            ])
        }
      ],
      disabled: false,
      api,
      imgName: '',
      visible: false,
      uploadList: [],
      curImageSrc: '',
      formItem: {}
    }
  },
  methods: {
    editShow (index, name) {
      this.modalEdit = true
      this.formEdit = JSON.parse(JSON.stringify(this.data[index]))
    },
    changePage (currentPage) {
      axios.post(api.getbannertable).then((res) => {
        let start = (currentPage - 1) * this.pageSize
        let end = currentPage * this.pageSize
        this.data = res.data.data.slice(start, end)
      }, (err) => {
        console.log(err)
      })
    },
    getBannerList (page) {
      axios.post(api.getbannertable).then((res) => {
        this.data = res.data.data
        this.dataCount = this.data.length
        if (this.data.length < this.pageSize) {
          this.data = res.data.data
        } else {
          this.data = res.data.data.slice(0, this.pageSize)
        }
      }, (err) => {
        console.log(err)
      })
    },
    deleteShow (index) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除当前所选数据么？',
        onOk: () => {
          const postData = {}
          postData.id = this.data[index].id
          postData.status = '-1'
          axios.post(api.deletebanner, postData).then((res) => {
            this.getBannerList()
            this.$Message.success(res.data.message)
          })
        }
      })
    },
    editSave (name) {
      let postData = {}
      postData = this.formEdit
      this.$refs[name].validate((valid) => {
        if (valid) {
          axios.post(api.editbanner, postData).then((res) => {
            this.modalEdit = false
            this.$Message.success(res.data.message)
            this.getBannerList()
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
    doAdd (name) {
      if (this.uploadList.length === 0) {
        this.$Notice.open({
          title: '提示',
          desc: '请上传至少一张图片'
        })
        this.loading = false
        return false
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          let postData = {}
          postData = JSON.parse(JSON.stringify(this.formAdd))
          postData.itemImage = []
          this.uploadList.forEach((v) => {
            const obj = {
              img_url: v.url
            }
            postData.itemImage.push(obj)
          })
          axios.post(api.bannerimagesubmit, postData)
          .then((res) => {
            this.modalAdd = false
            this.$Message.success(res.data.message)
            this.getBannerList()
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
    addShow (name) {
      this.$refs[name].resetFields()
      this.modalAdd = true
    },
    handleRemove (file) {
            // 从 upload 实例删除数据
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
      file.url = res.data
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
    previewAdd (res) {
      this.formEdit.img_url = res.data
    },
    handleBeforeUpload () {
      const check = this.uploadList.length < 1
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 1 张图片。'
        })
      }
      return check
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    setTimeout(() => {
      this.spinShow = false
    }, 1000)
    this.getBannerList()
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
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
</style>





