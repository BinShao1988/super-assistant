// cloudfunctions/payment/index.js
// 支付云函数 - 处理会员订阅支付
const cloud = require('wx-server-sdk');
cloud.init();

exports.main = async (event, context) => {
  const { action, data } = event;
  
  switch (action) {
    case 'createOrder':
      return await createOrder(data);
    case 'queryOrder':
      return await queryOrder(data);
    case 'refund':
      return await refund(data);
    default:
      return { success: false, message: '未知操作' };
  }
};

// 创建订单
async function createOrder(data) {
  const { plan, userId } = data;
  
  const plans = {
    monthly: {
      name: '月度会员',
      price: 19.9,
      duration: 30,
      features: ['无限对话', '情绪分析', '日程管理']
    },
    yearly: {
      name: '年度会员',
      price: 199,
      duration: 365,
      features: ['无限对话', '情绪分析', '日程管理', '优先客服']
    },
    lifetime: {
      name: '终身会员',
      price: 499,
      duration: 36500,
      features: ['所有功能', '永久使用', 'VIP特权', '专属客服']
    }
  };
  
  const selectedPlan = plans[plan];
  if (!selectedPlan) {
    return { success: false, message: '无效的套餐' };
  }
  
  // 创建订单记录
  const db = cloud.database();
  const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9);
  
  await db.collection('orders').add({
    data: {
      orderId: orderId,
      userId: userId,
      plan: plan,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      status: 'pending',
      createdAt: new Date()
    }
  });
  
  return {
    success: true,
    data: {
      orderId: orderId,
      planName: selectedPlan.name,
      amount: selectedPlan.price,
      features: selectedPlan.features
    }
  };
}

// 查询订单
async function queryOrder(data) {
  const { orderId } = data;
  const db = cloud.database();
  
  const res = await db.collection('orders')
    .where({ orderId: orderId })
    .get();
  
  return {
    success: true,
    data: res.data[0] || null
  };
}

// 退款
async function refund(data) {
  const { orderId, reason } = data;
  const db = cloud.database();
  
  // 更新订单状态
  await db.collection('orders')
    .where({ orderId: orderId })
    .update({
      data: {
        status: 'refunded',
        refundReason: reason,
        refundedAt: new Date()
      }
    });
  
  return {
    success: true,
    message: '退款申请已提交'
  };
}