// miniprogram/app.js - 增强版
App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'super-assistant-env',
        traceUser: true,
      });
    }
    
    // 初始化全局数据
    this.globalData = {
      userInfo: null,
      memberId: null,
      memberExpiry: null,
      currentMood: 'neutral',
      chatCount: 0,
      dailyLimit: 10,
      isLoggedIn: false
    };
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 检查会员状态
    this.checkMemberStatus();
  },
  
  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLoggedIn = true;
    }
  },
  
  // 检查会员状态
  async checkMemberStatus() {
    const db = wx.cloud.database();
    try {
      const res = await db.collection('members')
        .where({
          _openid: '{openid}',
          status: 'active',
          expiryDate: db.command.gt(new Date())
        })
        .get();
      
      if (res.data.length > 0) {
        const member = res.data[0];
        this.globalData.memberId = member._id;
        this.globalData.memberExpiry = member.expiryDate;
        this.globalData.dailyLimit = 999; // 会员无限对话
      }
    } catch (err) {
      console.log('检查会员状态失败:', err);
    }
  },
  
  // 检查是否可以对话
  canChat() {
    if (this.globalData.memberId) {
      return true; // 会员无限制
    }
    return this.globalData.chatCount < this.globalData.dailyLimit;
  },
  
  // 增加对话次数
  incrementChatCount() {
    this.globalData.chatCount++;
    wx.setStorageSync('chatCount', this.globalData.chatCount);
    wx.setStorageSync('lastChatDate', new Date().toDateString());
  },
  
  // 重置每日计数
  resetDailyCount() {
    const lastDate = wx.getStorageSync('lastChatDate');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      this.globalData.chatCount = 0;
      wx.setStorageSync('chatCount', 0);
      wx.setStorageSync('lastChatDate', today);
    } else {
      this.globalData.chatCount = wx.getStorageSync('chatCount') || 0;
    }
  }
});