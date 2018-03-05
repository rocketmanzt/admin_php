<template>
    <Breadcrumb>
        <Breadcrumb-item href="/">首页</Breadcrumb-item>
        <Breadcrumb-item v-for="(value,index) in $route.meta.breadCrumb" :key="index">{{value}}</Breadcrumb-item>
    </Breadcrumb>
</template>

<script>
export default {
}
</script>

<style>

</style>
