
// 云开发初始化脚本
// 在微信开发者工具的云开发控制台中运行

const cloud = require('wx-server-sdk');
cloud.init();

// 初始化数据库集合
async function initCollections() {
  const db = cloud.database();
  
  // 创建集合
  const collections = ['chat_history', 'members', 'orders', 'emotion_records', 'schedules'];
  
  for (const name of collections) {
    try {
      await db.createCollection(name);
      console.log('✅ 创建集合: ' + name);
    } catch (err) {
      console.log('ℹ️ 集合已存在: ' + name);
    }
  }
}

// 初始化默认数据
async function initDefaultData() {
  const db = cloud.database();
  
  // 添加示例会员套餐
  const plans = [
    {
      planId: 'monthly',
      name: '月度会员',
      price: 19.9,
      duration: 30,
      features: ['无限对话', '情绪分析', '日程管理', '优先客服']
    },
    {
      planId: 'yearly',
      name: '年度会员',
      price: 199,
      duration: 365,
      features: ['无限对话', '情绪分析', '日程管理', '优先客服', '专属功能']
    },
    {
      planId: 'lifetime',
      name: '终身会员',
      price: 499,
      duration: 36500,
      features: ['所有功能', '永久使用', 'VIP特权', '专属客服']
    }
  ];
  
  // 创建会员套餐集合
  try {
    await db.createCollection('membership_plans');
    for (const plan of plans) {
      await db.collection('membership_plans').add({ data: plan });
    }
    console.log('✅ 会员套餐初始化完成');
  } catch (err) {
    console.log('ℹ️ 会员套餐已存在');
  }
}

// 初始化系统配置
async function initSystemConfig() {
  const db = cloud.database();
  
  const config = {
    appId: 'your-appid',
    version: '1.0.0',
    buildTime: '2026-03-14T02:06:32.363Z',
    features: {
      aiChat: true,
      emotionAnalysis: true,
      scheduleManagement: true,
      membership: true
    },
    limits: {
      freeDailyChats: 10,
      memberDailyChats: 999
    }
  };
  
  try {
    await db.createCollection('system_config');
    await db.collection('system_config').add({ data: config });
    console.log('✅ 系统配置初始化完成');
  } catch (err) {
    console.log('ℹ️ 系统配置已存在');
  }
}

// 执行初始化
async function main() {
  console.log('🚀 开始初始化云开发环境...');
  
  await initCollections();
  await initDefaultData();
  await initSystemConfig();
  
  console.log('✅ 云开发环境初始化完成！');
}

main().catch(console.error);
