// pages/profile/profile.js
Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    menuList: [
      { icon: '⚙️', text: '设置', url: '/pages/settings/settings' },
      { icon: '📊', text: '使用统计', url: '/pages/stats/stats' },
      { icon: '💬', text: '反馈建议', url: '/pages/feedback/feedback' },
      { icon: '📖', text: '使用指南', url: '/pages/guide/guide' },
      { icon: '❤️', text: '关于我们', url: '/pages/about/about' }
    ]
  },
  
  onLoad() {
    this.checkLogin();
  },
  
  checkLogin() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo,
        isLoggedIn: true
      });
    }
  },
  
  onLogin() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          isLoggedIn: true
        });
        wx.setStorageSync('userInfo', res.userInfo);
      }
    });
  },
  
  onMenuClick(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({ url });
  }
});