// miniprogram/pages/member/member.js
// 会员中心页面
const app = getApp();

Page({
  data: {
    plans: [
      {
        id: 'monthly',
        name: '月度会员',
        price: 19.9,
        originalPrice: 39.9,
        duration: '30天',
        features: ['无限对话', '情绪分析', '日程管理', '优先客服'],
        popular: false
      },
      {
        id: 'yearly',
        name: '年度会员',
        price: 199,
        originalPrice: 478.8,
        duration: '365天',
        features: ['无限对话', '情绪分析', '日程管理', '优先客服', '专属功能'],
        popular: true
      },
      {
        id: 'lifetime',
        name: '终身会员',
        price: 499,
        originalPrice: 999,
        duration: '永久',
        features: ['所有功能', '永久使用', 'VIP特权', '专属客服', '新功能优先'],
        popular: false
      }
    ],
    selectedPlan: 'yearly',
    isMember: false,
    memberExpiry: ''
  },
  
  onLoad() {
    this.checkMemberStatus();
  },
  
  checkMemberStatus() {
    if (app.globalData.memberId) {
      this.setData({
        isMember: true,
        memberExpiry: new Date(app.globalData.memberExpiry).toLocaleDateString()
      });
    }
  },
  
  selectPlan(e) {
    const planId = e.currentTarget.dataset.plan;
    this.setData({ selectedPlan: planId });
  },
  
  async purchase() {
    if (!app.globalData.isLoggedIn) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '创建订单...' });
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'payment',
        data: {
          action: 'createOrder',
          data: {
            plan: this.data.selectedPlan,
            userId: app.globalData.userInfo.nickName
          }
        }
      });
      
      wx.hideLoading();
      
      if (res.result.success) {
        // 模拟支付（实际应调用微信支付）
        wx.showModal({
          title: '确认购买',
          content: `${res.result.data.planName} - ¥${res.result.data.amount}`,
          success: async (modalRes) => {
            if (modalRes.confirm) {
              await this.simulatePayment(res.result.data.orderId);
            }
          }
        });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: '创建订单失败',
        icon: 'error'
      });
    }
  },
  
  async simulatePayment(orderId) {
    wx.showLoading({ title: '支付中...' });
    
    // 模拟支付过程
    setTimeout(async () => {
      const db = wx.cloud.database();
      
      // 更新订单状态
      await db.collection('orders')
        .where({ orderId: orderId })
        .update({
          data: {
            status: 'paid',
            paidAt: new Date()
          }
        });
      
      // 创建会员记录
      const selectedPlan = this.data.plans.find(p => p.id === this.data.selectedPlan);
      const expiryDate = new Date();
      
      if (this.data.selectedPlan === 'monthly') {
        expiryDate.setDate(expiryDate.getDate() + 30);
      } else if (this.data.selectedPlan === 'yearly') {
        expiryDate.setDate(expiryDate.getDate() + 365);
      } else {
        expiryDate.setFullYear(expiryDate.getFullYear() + 100);
      }
      
      await db.collection('members').add({
        data: {
          plan: this.data.selectedPlan,
          status: 'active',
          expiryDate: expiryDate,
          createdAt: new Date()
        }
      });
      
      wx.hideLoading();
      
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });
      
      // 更新全局状态
      app.globalData.memberId = orderId;
      app.globalData.memberExpiry = expiryDate;
      app.globalData.dailyLimit = 999;
      
      this.setData({
        isMember: true,
        memberExpiry: expiryDate.toLocaleDateString()
      });
    }, 2000);
  }
});