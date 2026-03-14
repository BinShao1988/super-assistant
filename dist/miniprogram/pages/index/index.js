// pages/index/index.js
Page({
  data: {
    userInfo: null,
    todayTasks: [],
    mood: '😊',
    efficiency: 85
  },
  
  onLoad() {
    this.loadUserInfo();
  },
  
  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },
  
  navigateToChat() {
    wx.navigateTo({ url: '/pages/chat/chat' });
  },
  
  navigateToSchedule() {
    wx.switchTab({ url: '/pages/schedule/schedule' });
  },
  
  navigateToEmotion() {
    wx.switchTab({ url: '/pages/emotion/emotion' });
  }
});