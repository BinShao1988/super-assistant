// cloudfunctions/analytics/index.js
// 数据统计分析云函数
const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  switch (action) {
    case 'dailyStats':
      return await getDailyStats(data);
    case 'userBehavior':
      return await getUserBehavior(data);
    case 'revenue':
      return await getRevenue(data);
    default:
      return { success: false, message: '未知操作' };
  }
};

// 获取每日统计
async function getDailyStats(data) {
  const db = cloud.database();
  const $ = db.command.aggregate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 获取今日用户数
  const todayUsers = await db.collection('chat_history')
    .where({
      timestamp: db.command.gte(today)
    })
    .count();
  
  // 获取今日对话数
  const todayMessages = await db.collection('chat_history')
    .where({
      timestamp: db.command.gte(today)
    })
    .count();
  
  // 获取今日新增会员
  const newMembers = await db.collection('members')
    .where({
      createdAt: db.command.gte(today)
    })
    .count();
  
  return {
    success: true,
    data: {
      date: today.toISOString().split('T')[0],
      activeUsers: todayUsers.total,
      totalMessages: todayMessages.total,
      newMembers: newMembers.total,
      timestamp: new Date().toISOString()
    }
  };
}

// 获取用户行为分析
async function getUserBehavior(data) {
  const db = cloud.database();
  const { userId, days = 7 } = data;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const behaviors = await db.collection('chat_history')
    .where({
      userId: userId,
      timestamp: db.command.gte(startDate)
    })
    .orderBy('timestamp', 'desc')
    .get();
  
  // 统计情绪分布
  const moodDistribution = {};
  behaviors.data.forEach(item => {
    moodDistribution[item.mood] = (moodDistribution[item.mood] || 0) + 1;
  });
  
  return {
    success: true,
    data: {
      totalSessions: behaviors.data.length,
      moodDistribution: moodDistribution,
      avgSessionsPerDay: Math.round(behaviors.data.length / days * 10) / 10
    }
  };
}

// 获取收入统计
async function getRevenue(data) {
  const db = cloud.database();
  const { startDate, endDate } = data;
  
  const orders = await db.collection('orders')
    .where({
      status: 'paid',
      createdAt: db.command.and([
        db.command.gte(new Date(startDate)),
        db.command.lte(new Date(endDate))
      ])
    })
    .get();
  
  const totalRevenue = orders.data.reduce((sum, order) => sum + order.amount, 0);
  
  return {
    success: true,
    data: {
      totalRevenue: totalRevenue,
      orderCount: orders.data.length,
      avgOrderValue: orders.data.length > 0 ? Math.round(totalRevenue / orders.data.length * 100) / 100 : 0
    }
  };
}