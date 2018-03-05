<template>
<div>
    <Row>
        <Input v-model.trim="searchConName" icon="search" @on-change="handleSearch" placeholder="请输入手机号码搜索..." :maxlength="11" style="width: 200px" />
    </Row>
    <br/>
    <i-button type="primary" size="large" @click="exportData()"><Icon type="ios-download-outline"></Icon> 导出数据</i-button>
    <i-table   :columns="columns" :data="data" ref="tableCsv"></i-table>
        <br/>
    <Page :total="total" show-total @on-change="changePage" :page-size="pageSize"></Page>

            <Modal title="查看留言详情" v-model="modalShow" :mask-closable="false">
            <Form ref='formShow' :label-width="100" :model="formShow">
                <Row>
                    <Col span='12'>
                    <Form-item label="用户ip:">
                        <p>{{formShow.ip}}</p>
                    </Form-item>
                    </Col>
                    <Col span='12'>
                    <Form-item label="电话:">
                        <p>{{formShow.phone}}</p>
                    </Form-item>
                    </Col>
                </Row>
                <Row>
                    <Col span='12'>
                    <Form-item label="留言时间:">
                        <p>{{formShow.create_time}}</p>
                    </Form-item>
                    </Col>
                    <Col span='12'>
                    <Form-item label="状态:">
                        <p>{{formShow.status === '1' ? '已读' : '未读' }}</p>
                    </Form-item>
                    </Col>                    
                </Row>                  
                <Row>
                    <Col span='12'>
                    <Form-item label="留言内容:">
                        <p>{{formShow.messagebroad}}</p>
                    </Form-item>
                    </Col>
                </Row> 
            </Form>
        </Modal>
</div>
</template>
<script>
import api from '../utils/api'
import axios from 'axios'
export default {
  data () {
    return {
      searchConName: '',
      pageSize: 2,
      modalShow: false,
      formShow: {
        ip: '',
        phone: '',
        messagebroad: ''
      },
      data: [],
      total: 0,
      columns: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: 'ip地址',
          key: 'ip'
        },
        {
          title: '手机号码',
          key: 'phone'
        },
        {
          title: '留言内容',
          key: 'messagebroad',
          ellipsis: true
        },
        {
          title: '留言时间',
          key: 'create_time'
        },
        {
          title: '状态',
          key: 'status',
          render: (h, params) => {
            const row = params.row
            const color = row.status === '-1' ? 'red' : 'black'
            const text = row.status === '-1' ? '未读' : '已读'
            return h('p', {
              style: {
                color: color
              }
            }, text)
          }
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
                    this.show(params.index)
                  }
                }
              }, '查看'),
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
                    this.signShow(params.index)
                  }
                }
              }, '撤销')
            ])
        }
      ]
    }
  },
  methods: {
    _getMessageList (params) {
      let postData = {}
      postData.pageSize = 2
      postData.pageNo = params || 1
      postData.searchConName = this.searchConName
      axios.post(api.getMessageList, postData).then((res) => {
        this.data = res.data.data
        this.total = res.data.total
      }, (err) => {
        console.log(err)
      })
    },
    show (index) {
      const postData = {}
      postData.id = this.data[index].id
      postData.status = '1'
      axios.post(api.signMessageList, postData).then((res) => {
        this._getMessageList()
      })
      this.formShow = this.data[index]
      this.modalShow = true
    },
    signShow (index) {
      this.$Modal.confirm({
        title: '撤销确认',
        content: '<p>确认撤销么？',
        onOk: () => {
          const postData = {}
          postData.id = this.data[index].id
          postData.status = '-1'
          axios.post(api.signMessageList, postData).then((res) => {
            this._getMessageList()
            this.$Message.success(res.data.message)
          })
        }
      })
    },
    changePage (currentPage) {
      this._getMessageList(currentPage)
    },
    handleSearch (params) {
      let postData = {}
      postData.pageSize = 2
      postData.pageNo = params || 1
      postData.searchConName = this.searchConName
      axios.post(api.getMessageList, postData).then((res) => {
        this.data = res.data.data
        this.total = res.data.total
      }, (err) => {
        console.log(err)
      })
    },
    exportData () {
      this.$refs.tableCsv.exportCsv({
        filename: '表格数据',
        columns: this.columns.filter((col, index) => index < 5),
        data: this.data.filter((data, index) => index < 4)
      })
    }
  },
  mounted () {
    this._getMessageList()
  }
}
</script>