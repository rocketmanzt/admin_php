<template>
	<div>
		<row>
			<i-col span="8"><i-input v-model="searchInfo.itemName" placeholder="请输入..." style="width:200px"><span slot="prepend">姓名:</span></i-input>
			</i-col>
            <i-col span="8">
            	<span>电话:</span><i-input  placeholder="请输入..." style="width:200px"></i-input>
            </i-col>				
			<i-col span="8">
				<Date-picker  format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期"></Date-picker></i-col>
		</row>
		<br/>
		<i-table  :columns="columns1" :data="data1"></i-table>
    <br/>
		<Page :total="dataCount"  :page-size="pageSize" show-total @on-change="changePage"></Page>
	</div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      pageSize: 5,
      dataCount: 0,
      curPage: 1,
      searchInfo: {
        itemId: '',
        itemName: '',
        status: ''
      },
      columns1: [
        {
          title: '人员',
          key: 'username'
        },
        {
          title: '操作',
          key: 'shenpistatus'
        },
        {
          title: '意见',
          key: 'shenpicomments'
        },
        {
          title: '时间',
          key: 'time'
        }
      ],
      data1: []
    }
  },
  created: function () {
    axios.get('api/getData1')
    .then((res) => {
      this.data1 = res.data
      this.dataCount = this.data1.length
      if (this.data1.length < this.pageSize) {
        this.data1 = res.data
      } else {
        this.data1 = res.data.slice(0, this.pageSize)
      }
    }, (err) => {
      console.log(err)
    })
  },
  methods: {
    onchange () {
      alert(this.searchInfo.itemName)
    },
    changePage (currentPage) {
      this.$http.get('http://localhost:3000/getData1')
      .then((res) => {
        let start = (currentPage - 1) * this.pageSize
        let end = currentPage * this.pageSize
        this.data1 = res.data.slice(start, end)
      }, (err) => {
        console.log(err)
      })
    }
  }
}
</script>