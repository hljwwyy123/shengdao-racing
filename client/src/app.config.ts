export default {
  pages: [
    'pages/rank/index',
    'pages/index/index',
    'pages/my/index',
    'pages/scanQRCode/index',
    'pages/bindWXTimer/index',
    'pages/history/index',
    'pages/track/index',
    'pages/activity/index'
  ],
  tabBar: {
    // custom: true,
    color: '#fff',
    selectedColor: '#f53d4d',
    backgroundColor: '#1f232d',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '圈速数据',
        iconPath: 'assets/images/rank.png',
        selectedIconPath: 'assets/images/rank-active.png',
      },
      {
        pagePath: 'pages/rank/index',
        text: '排行榜',
        iconPath: 'assets/images/total-rank.png',
        selectedIconPath: 'assets/images/total-rank-active.png',
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: 'assets/images/my.png',
        selectedIconPath: 'assets/images/my-active.png',
      },
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#1f232d',
    navigationBarTitleText: '圈速榜',
    navigationBarTextStyle: 'white',
    backgroundColor: '#1f232d'
  },
  cloud: true,
  plugins: {
    "wxacommentplugin": {
      "version": "1.0.1",
      "provider": "wx82e6ae1175f264fa" // 必须填该评价组件appid，该示例值即为评价组件appid（复制时请去掉注释）
    }
  }
}
