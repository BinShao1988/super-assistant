// pages/emotion/emotion.js
Page({
  data: {
    currentMood: 'happy',
    emotionHistory: []
  },
  
  onLoad() {
    this.loadEmotionData();
  },
  
  loadEmotionData() {
    // 模拟数据
    this.setData({
      emotionHistory: [
        { date: '2024-03-13', mood: '😊', note: '今天工作很顺利' },
        { date: '2024-03-12', mood: '😌', note: '冥想后心情平静' },
        { date: '2024-03-11', mood: '😢', note: '遇到一些挫折' }
      ]
    });
  },
  
  recordEmotion() {
    wx.showToast({ title: '情绪记录功能开发中', icon: 'none' });
  }
});