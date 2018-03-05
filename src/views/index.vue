<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
    }
    .layout-breadcrumb{
        padding: 10px 15px 0;
    }
    .layout-content{
        min-height: 400px;
        margin: 15px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 10px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-menu-left{
        background: #464c5b;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .header-title{
        height: 60px;
        line-height: 60px;
        margin-left: 20px;
        padding-right: 14px;
        font-size: 12px;
    } 
    .logintime{
      color: #999;
      padding-left: 5px;
    }    
</style>
<template>
    <div class="layout">
        <Row type="flex">
            <Col span="5" class="layout-menu-left" >
                <Menu  theme="dark" width="auto" @on-select="goRoute">
                    <div class="layout-logo-left"></div>
                    <Submenu v-for="nav in submenuList" :name="nav.id" :key="nav.id">
                       <template slot="title">
                           <Icon type="ios-analytics"></Icon>
                           {{nav.name}}
                       </template>
                       <MenuItem v-for="item in nav.list" :name="item.name" :key="item.id">
                         {{item.title}}
                       </MenuItem>                   	
                    </Submenu>
                </Menu>
            </Col>
            <Col span="19">
                <div class="layout-header">
                  <div class="header-title">  
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar  style="background: #999;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                  </div>
                </div>
                <div class="layout-breadcrumb">
                    <Breadcrumb>
                        <BreadcrumbItem href="#" v-for="(value,index) in $route.meta.breadCrumb" :key="index">{{value}}</BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div class="layout-content">
                    <div class="layout-content-main">
                    <keep-alive>
                    <router-view></router-view>
                    </keep-alive>
                    </div>
                </div>
                <div class="layout-copy">
                    2011-2016 &copy; TalkingData
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      userName: '',
      spanLeft: 5,
      spanRight: 19,
      submenuList: [
        {
          name: '用户管理',
          id: 1,
          list: [
            {
              title: '用户列表',
              name: 'userList',
              id: 1
            }
          ]
        },
        {
          name: '首页管理',
          id: 2,
          list: [
            {
              title: '添加商品',
              name: '/upload1',
              id: 1
            },
            {
              title: '添加商品图片',
              name: 'upload',
              id: 2
            },
            {
              title: '添加banner图',
              name: 'uploadbanner',
              id: 3
            }
          ]
        },
        {
          name: '商品列表',
          id: 3,
          list: [
            {
              title: '水果',
              name: '/fruit',
              id: 1
            },
            {
              title: '甜品',
              name: '/dessert',
              id: 2
            }
          ]
        },
        {
          name: '留言管理',
          id: 3,
          list: [
            {
              title: '留言列表',
              name: 'message',
              id: 1
            }
          ]
        },
        {
          name: '新闻管理',
          id: 4,
          list: [
            {
              title: '新闻列表',
              name: 'news',
              id: 1
            },
            {
              title: '新闻大图',
              name: 'newsBanner',
              id: 2
            }
          ]
        }
      ]
    }
  },
  methods: {
    goRoute (name) {
      this.$router.push(`${name}`)
    },
    init () {
      this.userName = Cookies.get('user')
    },
    handleClickUserDropdown (name) {
      if (name === 'loginout') {
        Cookies.remove('user')
        Cookies.remove('password')
        Cookies.remove('access')
        this.$router.push({
          name: 'login'
        })
      } else if (name === 'ownSpace') {
        this.$Notice.warning({
          desc: '开发中...'
        })
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
