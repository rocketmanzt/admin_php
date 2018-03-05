<template>
<div> 
 <Modal title="编辑" v-model="modalEdit" @on-ok="editSave('formEdit')" :loading="loading" :mask-closable="false">
            <Form ref="formEdit" :label-width="80" :model="formEdit" :rules="ruleAdd">
                  <Form-item label="缩约图上传" >
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
                      :action="api.newsbannerimage"
                      style="display: inline-block;width:58px;">
                      <div style="width: 58px;height:58px;line-height: 58px;">
                          <Icon type="camera" size="20"></Icon>
                      </div>
                  </Upload>
                </Form-item>
               <Form-item label="新闻标题" prop="title">
                    <Input v-model="formEdit.title"></Input>
                </Form-item>
                <Form-item label="排序" prop="rank">
                    <Input v-model.number="formEdit.rank">
                    <Tooltip :content="help.rank"  slot="append">
                        <Icon type="information-circled"></Icon>
                    </Tooltip>                    
                    </Input>
                </Form-item>
                <Form-item label="简介" prop="introduce">
                    <Input v-model="formEdit.introduce">
                    </Input>
                </Form-item>
                <Form-item label="内容" prop="content">
                 <vue-editor v-model="formEdit.content"></vue-editor>
                </Form-item>                
                <Form-item label="链接" prop="url">
                    <Input v-model="formEdit.url"></Input>
                </Form-item>              
           </Form>  
 </Modal> 
 <Modal title="新增" :loading="loading" v-model="modalAdd"  @on-ok="doAdd('formAdd')" :mask-closable="false">
        <Form  ref="formAdd" :label-width="100" :rules="ruleAdd" :model="formAdd">
            <Form-item label="图片上传" >
       <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                <i class="ivu-icon ivu-icon-ios-eye-outline" @click="handleView(item.name,item.url)"></i>                   
                <i class="ivu-icon ivu-icon-ios-trash-outline" @click="handleRemove(item)"></i>
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
                :action="api.newsbannerimage"
                style="display: inline-block;width:58px;">
                <div style="width:58px;height:58px;line-height:58px;">
                    <Icon type="camera" size="20"></Icon>
                </div>
            </Upload>     
            </Form-item>
            <Form-item label="新闻标题" prop="title">
                <Input v-model="formAdd.title"></Input>
            </Form-item>           
            <Form-item label="排序" prop="rank">
                <Input v-model.number="formAdd.rank">
                <Tooltip :content="help.rank"  slot="append">
                    <Icon type="information-circled"></Icon>
                </Tooltip>                
                </Input>
            </Form-item>
            <Form-item label="简介" prop="introduce">
                <Input v-model="formAdd.introduce">
                </Input>
            </Form-item>
            <Form-item label="内容" prop="content">
             <vue-editor v-model="formAdd.content"></vue-editor>
            </Form-item>
            <Form-item label="链接" prop="url">
             <i-input v-model="formAdd.url">
                <span slot="prepend">http://</span>
                <span slot="append">.com</span>
            </i-input>
            </Form-item>
        </Form>
    </Modal>  
<Modal title="查看图片" v-model="visible">
    <img :src="curImageSrc" v-if="visible" style="width: 100%">
</Modal>                           	
<Button type='primary' @click="addShow('formAdd')">新增新闻</Button>
    <i-button type="primary"  @click="exportData()"><Icon type="ios-download-outline"></Icon> 导出数据</i-button>
    <i-table   :columns="columns" :data="data" ref="tableCsv"></i-table>
        <br/>
    <Page :total="total"  show-total @on-change="changePage" :page-size="pageSize"></Page>
</div>
</template>

<script>
import help from '@/utils/help'
import { VueEditor } from 'vue2-editor'
import api from '../utils/api'
import axios from 'axios'
export default {
  components: {
    VueEditor
  },
  data () {
    return {
      help,
      api,
      uploadList: [],
      visible: false,
      modalAdd: false,
      modalEdit: false,
      searchConName: '',
      pageSize: 10,
      loading: true,
      modalShow: false,
      formAdd: {
        title: '',
        rank: '',
        url: '',
        content: '',
        introduce: ''
      },
      formEdit: {
        title: '',
        rank: '',
        url: '',
        content: '',
        introduce: ''
      },
      ruleAdd: {
        title: [
              { required: true, type: 'string', message: '名称不能为空', trigger: 'blur' }
        ],
        rank: [
              { required: true, type: 'number', message: '排序不能为空且应为数字', trigger: 'blur' }
        ],
        url: [
              { required: true, message: '链接不能为空', trigger: 'blur' }
        ],
        introduce: [
              { required: true, message: '简介不能为空', trigger: 'blur' }
        ],
        content: [
              { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      },
      data: [],
      total: 0,
      columns: [
        {
          type: 'index',
          width: 70,
          align: 'center'
        },
        {
          title: 'newsid',
          key: 'news_id'
        },
        {
          title: '新闻标题',
          key: 'title',
          ellipsis: true
        },
        {
          title: '简介',
          key: 'introduce',
          ellipsis: true
        },
        {
          title: '排序',
          key: 'rank',
          sortable: true
        },
        {
          title: '链接地址',
          key: 'url'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '更新时间',
          key: 'update_time'
        },
        {
          title: '缩约图',
          key: 'img_url',
          render: (h, params) =>
            h('div', [
              h('img', {
                attrs: {
                  src: params.row.img_url
                },
                style: {
                  width: '80px',
                  height: '40px',
                  padding: '5px 0px',
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    this.show(params.row.img_url)
                  }
                }
              })
            ])
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
                  type: 'success',
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
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.deleteShow(params.index)
                  }
                }
              }, '删除')
            ])
        }
      ]
    }
  },
  methods: {
    _getNewsList (params) {
      let postData = {}
      postData.pageSize = 10
      postData.pageNo = params || 1
      postData.searchConName = this.searchConName
      axios.post(api.getNewsList, postData).then((res) => {
        this.data = res.data.data
        this.total = res.data.total
      }, (err) => {
        console.log(err)
      })
    },
    doAdd (name) {
      if (this.uploadList.length === 0) {
        this.$Notice.open({
          title: '提示',
          desc: '请上传至少一张图片'
        })
        this.loading = false
        this.$nextTick(() => {
          this.loading = true
        })
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          let postData = {}
          postData = this.formAdd
          postData.itemImage = []
          this.uploadList.forEach((v) => {
            const obj = {
              img_url: v.url
            }
            postData.itemImage.push(obj)
          })
          axios.post(api.addNewsList, postData)
          .then((res) => {
            if (res.data.status === 0) {
              this.$Message.error(res.data.message)
              this.loading = false
              this.$nextTick(() => {
                this.loading = true
              })
            } else {
              this.$Message.success(res.data.message)
              this.modalAdd = false
              this._getNewsList()
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
    editShow (index, name) {
      this.$refs[name].resetFields()
      this.modalEdit = true
      this.formEdit.img_url = ''
      this.formEdit = JSON.parse(JSON.stringify(this.data[index]))
      this.formEdit.rank = parseInt(this.formEdit.rank)
    },
    addShow (name) {
      this.$refs[name].resetFields()
      this.modalAdd = true
    },
    deleteShow (index) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>确认删除当前所选数据么？',
        onOk: () => {
          let postData = {}
          postData.news_id = this.data[index].news_id
          postData.status = '-1'
          axios.post(api.deleteNews, postData).then((res) => {
            this._getNewsList()
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
          axios.post(api.editNews, postData).then((res) => {
            this.modalEdit = false
            this.$Message.success(res.data.message)
            this._getNewsList()
            this.$refs[name].resetFields()
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
    },
    show (url) {
      this.visible = true
      this.curImageSrc = url
    },
    handleView (name, url) {
      this.imgName = name
      this.visible = true
      this.curImageSrc = url
    },
    exportData () {
      this.$refs.tableCsv.exportCsv({
        filename: '表格数据',
        columns: this.columns.filter((col, index) => index < 5),
        data: this.data.filter((data, index) => index < 10)
      })
    },
    changePage (currentPage) {
      this._getNewsList(currentPage)
    }
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
    this._getNewsList()
  },
  destroyed () {
    this.editor.destroy()
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