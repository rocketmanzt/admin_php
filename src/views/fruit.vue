<template>
<div>
    <i-table  :columns="columns1" :data="data"></i-table>
    <br/>
        <i-button type="primary" size="large" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出原始数据</i-button>
        <br/>
    <Page :total="dataCount"  :page-size="pageSize" show-total @on-change="changePage"></Page>

</div>
</template>
<script>
export default {
  data () {
    return {
      dataCount: 0,
      pageSize: 4,
      columns1: [
        {
          title: 'ID',
          key: 'id'
        },
        {
          title: '商品名称',
          key: 'product_name'
        },
        {
          title: '商品类型',
          key: 'product_type'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '简介',
          key: 'product_introduct'
        }
      ]
    }
  },
  computed: {
    data () {
      return this.$store.getters.getFruitList
    }
  },
  methods: {
    exportData (type) {
      if (type === 1) {
        this.$refs.table.exportCsv({
          filename: '原始数据'
        })
      }
    },
    changePage () {
      this.$store.commit('updateParams', {
        key: 'id',
        val: this.formEdit.date
      })
      this.$store.dispatch('fetchFruitList')
    }
  },
  mounted () {
    this.$store.dispatch('fetchFruitList')
  }
}
</script>