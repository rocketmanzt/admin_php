const debug = process.env.NODE_ENV !== 'production'
const path = debug ? document.location.origin : 'http://www.flyzt.site'
const urls = {
  login: `${path}/index.php?m=home&c=login&a=check`,
  getuserlist: `${path}/index.php?m=home&c=admin&a=userTable`,
  useradd: `${path}/index.php?m=home&c=admin&a=add`,
  select: `${path}/index.php?m=home&c=product&a=selectProduct`, // 正确路径
  pages: `${path}/index.php?m=home&c=product&a=selectProduct`,
  uploadaction: `${path}/index.php?m=home&c=image&a=ajaxuploadimage`,
  uploadsubmit: `${path}/index.php?m=home&c=product&a=productFrom`,
  bannerimage: `${path}/index.php?m=home&c=image&a=ajaxbannerimage`,
  bannerimagesubmit: `${path}/index.php?m=home&c=image&a=bannersubmit`,
  editbanner: `${path}/index.php?m=home&c=image&a=editbanner`,
  deletebanner: `${path}/index.php?m=home&c=image&a=deletebanner`,
  getbannertable: `${path}/index.php?m=home&c=image&a=getbannertable`,
  getMessageList: `${path}/index.php?m=home&c=message&a=select`,
  signMessageList: `${path}/index.php?m=home&c=message&a=signMessage`,
  addNewsList: `${path}/index.php?m=home&c=news&a=add`,
  getNewsList: `${path}/index.php?m=home&c=news&a=select`,
  deleteNews: `${path}/index.php?m=home&c=news&a=delete`,
  editNews: `${path}/index.php?m=home&c=news&a=edit`,
  addBannerList: `${path}/index.php?m=home&c=news&a=addbanner`,
  newsbannerimage: `${path}/index.php?m=home&c=image&a=ajaxnewsbannerimage`,
  getNewsBannerList: `${path}/index.php?m=home&c=news&a=selectbanner`,
  deleteNewsBanner: `${path}/index.php?m=home&c=news&a=newsbannerdelete`,
  editNewsBanner: `${path}/index.php?m=home&c=news&a=editnewsbanner`
}
export default urls
