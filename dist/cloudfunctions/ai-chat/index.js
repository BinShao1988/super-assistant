// cloudfunctions/ai-chat/index.js
// AI对话云函数 - 支持多种AI服务商
const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const { message, mood, userId } = event;
  
  // 智能回复系统
  const intelligentReplies = {
    // 开心情绪回复
    happy: [
      "看到你这么开心，我也很高兴！继续保持这份好心情！✨",
      "你的快乐真的很有感染力呢！愿你每天都有这样的好心情！🌟",
      "太棒了！开心的你就像小太阳一样温暖！☀️",
      "这份喜悦值得分享！你今天遇到了什么好事呢？🎉",
      "保持这份积极的心态，它会带给你更多好运！💫"
    ],
    
    // 平静情绪回复
    calm: [
      "这份平静很难得，享受当下的宁静吧。🍃",
      "心如止水，这是一种很好的状态。愿你保持这份平和。🌊",
      "平静的内心是最强大的力量。💪",
      "这种状态很适合思考和规划。有什么想法吗？💭",
      "宁静致远，你的心境很棒！✨"
    ],
    
    // 难过情绪回复
    sad: [
      "我理解你现在的心情。记住，每个人都会有低谷期，但你并不孤单。💫",
      "难过的时候，让我陪在你身边吧。明天会更好的，我相信你！🌈",
      "拥抱一下。你的感受很重要，给自己一些时间来治愈。💕",
      "允许自己难过一会儿，然后我们一起找到解决办法。🤗",
      "记住，暴风雨后总会有彩虹。我支持你！🌈"
    ],
    
    // 愤怒情绪回复
    angry: [
      "我理解你的愤怒。深呼吸，让我们一起找到冷静的方法。🌬️",
      "愤怒是正常的情绪，但让我们用理性的方式来处理。💪",
      "先冷静一下，然后告诉我发生了什么，我会帮你分析。🧘",
      "这确实让人很生气。但冷静下来后，我们可以找到更好的解决方案。✨",
      "你的愤怒说明你在乎这件事。让我们一起想办法解决。💡"
    ],
    
    // 焦虑情绪回复
    anxious: [
      "深呼吸，一切都会好起来的。让我们一起找到解决问题的方法。🙏",
      "焦虑是正常的，但请相信自己有能力应对。你可以的！💪",
      "让我们一步步来，先关注当下最重要的事情。我支持你！✨",
      "把担心的事情列出来，我们一件件解决。📝",
      "你现在很安全，深呼吸，放松肩膀。我会陪着你。🤗"
    ],
    
    // 中性情绪回复
    neutral: [
      "你好！我是你的超级助理，有什么我可以帮助你的吗？😊",
      "今天想聊聊什么？我随时准备为你提供支持！💡",
      "记住，无论何时需要，我都在这里陪伴你！🌟",
      "有什么我可以帮你的吗？无论是工作还是生活，我都愿意倾听。💭",
      "随时告诉我你的需要，我会尽力帮助你！✨"
    ]
  };
  
  // 检测情绪关键词
  const detectMood = (text) => {
    const keywords = {
      happy: ['开心', '高兴', '快乐', '幸福', '棒', '好', '太好了', '哈哈', '谢谢', '感谢'],
      sad: ['难过', '伤心', '悲伤', '失落', '不开心', '想哭', '郁闷'],
      angry: ['生气', '愤怒', '烦躁', '讨厌', '气死', '火大'],
      anxious: ['焦虑', '担心', '紧张', '不安', '害怕', '恐慌', '压力']
    };
    
    for (const [moodKey, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (text.includes(word)) {
          return moodKey;
        }
      }
    }
    return 'neutral';
  };
  
  // 获取回复
  const detectedMood = mood || detectMood(message);
  const replies = intelligentReplies[detectedMood] || intelligentReplies.neutral;
  const reply = replies[Math.floor(Math.random() * replies.length)];
  
  // 记录对话（用于后续分析）
  const db = cloud.database();
  try {
    await db.collection('chat_history').add({
      data: {
        userId: userId || 'anonymous',
        message: message,
        mood: detectedMood,
        reply: reply,
        timestamp: new Date()
      }
    });
  } catch (err) {
    console.log('记录失败，但不影响回复');
  }
  
  return {
    success: true,
    data: {
      reply: reply,
      mood: detectedMood,
      timestamp: new Date().toISOString(),
      suggestions: getSuggestions(detectedMood)
    }
  };
};

// 获取建议
function getSuggestions(mood) {
  const suggestions = {
    happy: ['分享你的喜悦', '记录美好时刻', '保持积极心态'],
    sad: ['倾诉你的感受', '做一些喜欢的事', '和朋友聊聊'],
    angry: ['深呼吸放松', '理性分析问题', '寻找解决方案'],
    anxious: ['列出待办事项', '专注当下', '寻求支持'],
    neutral: ['规划今天的目标', '学习新知识', '保持好状态']
  };
  return suggestions[mood] || suggestions.neutral;
}