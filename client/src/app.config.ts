export default {
  pages: [
    'pages/index/index',
    'pages/scanQRCode/index',
    'pages/rank/index',
    'pages/my/index'
  ],
  tabBar: {
    // custom: true,
    color: '#707070',
    selectedColor: 'white',
    backgroundColor: '#1f232d',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '实时',
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
    navigationBarTextStyle: 'black',
    backgroundColor: '#1f232d'
  },
  cloud: true,
}
