## 该项目使用react+ant+axios+redux+react-router

  商品后台管理系统pwa

## 实现功能：

### 用户登录(token鉴权)

  将用户输入的表单信息提交给服务端验证

  若登录成功，将用户信息用redux存起来

  同时将用户信息保存到localstorage(包括一个标记用户是否已经登录的标记)

  每次如果刷新页面，redux中的用户信息在reducer中初始化的时候先从localstorage中读取

  若退出登录清空localstorage

  进入登录界面先从redux中读取用户信息和用户是否已经登录的标记，若未则进行登录

  若已经登录通过Redirect重定向到首页(首页页面类似)

### 除登录外所有的请求头都用axios的拦截器加上Authorization：token

### 页面右上角显示当前城市及天气情况和时间

  这里使用到高德地图的api，用promise发送连续的请求，首先带着自己的ip请求到当前城市的

  城市编码，随后通过城市编码去请求天气信息

### 商品分类管理

  修改和添加分类，复用antd模态框

  分页采用假分页(数据一次性从后台拉取过来，然后分页进行展示)

### 商品管理

  商品详情页面

  商品的上下架

  商品修改和添加（复用antd模态框）

  分页采用真分页，一次请求一页的数据进行展示

  搜索功能：按商品名称搜索，按商品描述搜索

  新增商品和修改商品页有图片上传组件（antd的upload）修改，可上传图片到服务端，可删除服务端图片

  和富文本组件（wysiwyg）

### 角色管理

  新增角色，可设置授权，（antd的tree组件）

### 用户管理

  创建修改删除用户