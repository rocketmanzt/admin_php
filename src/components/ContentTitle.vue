<template>
<div class="contentTile">
    {{title}}
</div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
.contentTile{
    padding-bottom: 10px;
    border-bottom: 1px solid #cccccc;
    margin-bottom: 30px;
    font-weight: 700;
}
</style>

