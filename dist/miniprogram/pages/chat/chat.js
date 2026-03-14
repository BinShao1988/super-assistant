// pages/chat/chat.js
Page({
  data: {
    messages: [],
    inputText: '',
    quickReplies: ['今天感觉怎么样？', '帮我安排日程', '我需要建议', '谢谢关心']
  },
  
  onLoad() {
    this.setData({
      messages: [{
        id: 1,
        role: 'assistant',
        content: '您好！我是您的超级助理，随时为您提供帮助和支持 😊',
        time: new Date().toLocaleTimeString()
      }]
    });
  },
  
  onInputChange(e) {
    this.setData({ inputText: e.detail.value });
  },
  
  onSend() {
    const text = this.data.inputText.trim();
    if (!text) return;
    
    // 添加用户消息
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString()
    };
    
    this.setData({
      messages: [...this.data.messages, userMsg],
      inputText: ''
    });
    
    // 模拟AI回复
    setTimeout(() => {
      const replies = [
        '我理解您的感受，让我帮您想想解决办法。',
        '这是个很好的想法！我支持您的决定。',
        '根据您的情况，我建议您这样做...',
        '别担心，我们一起面对这个挑战。',
        '您的想法很有价值，值得进一步探讨。'
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        time: new Date().toLocaleTimeString()
      };
      
      this.setData({
        messages: [...this.data.messages, aiMsg]
      });
    }, 1000);
  }
});