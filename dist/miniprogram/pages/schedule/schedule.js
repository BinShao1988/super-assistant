// pages/schedule/schedule.js
Page({
  data: {
    schedules: [],
    currentDate: new Date().toLocaleDateString()
  },
  
  onLoad() {
    this.loadSchedules();
  },
  
  loadSchedules() {
    // 模拟数据
    this.setData({
      schedules: [
        { id: 1, time: '09:00', title: '团队会议', description: '周例会讨论项目进展' },
        { id: 2, time: '14:00', title: '客户拜访', description: '重要客户洽谈' },
        { id: 3, time: '16:30', title: '项目评审', description: '季度项目评估' }
      ]
    });
  },
  
  addSchedule() {
    wx.showToast({ title: '添加日程功能开发中', icon: 'none' });
  }
});