// ============================================
// 朋友圈动态数据 - Moments Data
// ============================================
// 使用方法：
// 1. 在 moments 数组中添加新的动态对象
// 2. 图片放在 public/moments/ 目录下
// 3. 保存文件后，git commit 并 push 到仓库
// ============================================

export interface MomentComment {
    name: string;
    text: string;
    replyTo?: string;
}

export interface Moment {
    id: string;
    name: string;
    avatar: string;
    avatarBg: string;
    avatarColor: string;
    time: string;
    text: string;
    images: string[];  // 图片路径，相对于 public/ 目录
    location?: string;
    likes: string[];
    comments: MomentComment[];
}

export const moments: Moment[] = [
    {
        id: '1',
        name: '林夏',
        avatar: '夏',
        avatarBg: '#d1fae5',
        avatarColor: '#065f46',
        time: '2小时前',
        text: '今天的晚霞像被柚子汽水泡过，走到江边刚好赶上最后一抹橘色。生活偶尔给的小礼物，都是值得记住的瞬间 🌅',
        images: ['/moments/sunset-1.jpg', '/moments/sunset-2.jpg', '/moments/sunset-3.jpg'],
        location: '滨江步道',
        likes: ['阿泽', 'Mia', '小李', '周南'],
        comments: [
            { name: '阿泽', text: '这配色太治愈了！' },
            { name: '林夏', text: '下次一起去拍 📸', replyTo: '阿泽' },
            { name: 'Mia', text: '好美！求定位' },
        ],
    },
    {
        id: '2',
        name: '周南',
        avatar: '南',
        avatarBg: '#dbeafe',
        avatarColor: '#1e40af',
        time: '昨天 23:16',
        text: '加班结束，便利店热牛奶 + 饭团，打工人深夜续命套餐。',
        images: ['/moments/night-snack.jpg'],
        location: '',
        likes: ['Elon', 'Cindy'],
        comments: [{ name: 'Cindy', text: '辛苦啦，早点休息 ❤️' }],
    },
    {
        id: '3',
        name: 'Elon Woo',
        avatar: 'EW',
        avatarBg: '#fef3c7',
        avatarColor: '#92400e',
        time: '前天 18:42',
        text: '新入手的机械键盘到了，Cherry红轴手感真的绝！终于不用再忍受薄膜键盘了。码字效率直接翻倍 ⌨️',
        images: ['/moments/keyboard-1.jpg', '/moments/keyboard-2.jpg'],
        location: '家里',
        likes: ['林夏', '阿泽', 'Mia', '周南', '小李', 'Cindy'],
        comments: [
            { name: '阿泽', text: '哪个型号？我也想换一把' },
            { name: 'Elon Woo', text: 'IQUNIX F97，推荐！', replyTo: '阿泽' },
        ],
    },
    {
        id: '4',
        name: 'Mia',
        avatar: 'M',
        avatarBg: '#fce7f3',
        avatarColor: '#9d174d',
        time: '3天前',
        text: '周末去了趟山里的咖啡馆，被窗外的风景治愈了。拿铁拉花也很可爱，店主是个很有趣的人，聊了很久关于咖啡豆的故事 ☕',
        images: [
            '/moments/coffee-1.jpg',
            '/moments/coffee-2.jpg',
            '/moments/coffee-3.jpg',
            '/moments/coffee-4.jpg'
        ],
        location: '山间咖啡·隐庐',
        likes: ['林夏', '周南'],
        comments: [
            { name: '林夏', text: '这家店我也想去！地址发一下' },
            { name: 'Mia', text: '导航搜"隐庐咖啡"就能找到～', replyTo: '林夏' },
        ],
    },
    {
        id: '5',
        name: '阿泽',
        avatar: '泽',
        avatarBg: '#e0e7ff',
        avatarColor: '#3730a3',
        time: '4天前',
        text: '读完了《人生海海》，麦家的文字真的很有力量。有时候觉得人生就是这样，潮起潮落，但总归要往前走。推荐给大家 📖',
        images: [],
        location: '',
        likes: ['Elon', '林夏', 'Cindy', 'Mia'],
        comments: [
            { name: 'Elon', text: '好书！我去年读的，印象很深' },
            { name: '林夏', text: '加入书单了 📚' },
        ],
    },
    {
        id: '6',
        name: 'Cindy',
        avatar: 'C',
        avatarBg: '#fef9c3',
        avatarColor: '#854d0e',
        time: '5天前',
        text: '公司团建的烘焙课，第一次做戚风蛋糕居然没翻车！虽然颜值一般但味道还不错哈哈 🎂',
        images: [
            '/moments/baking-1.jpg',
            '/moments/baking-2.jpg',
            '/moments/baking-3.jpg',
            '/moments/baking-4.jpg',
            '/moments/baking-5.jpg',
            '/moments/baking-6.jpg',
            '/moments/baking-7.jpg',
            '/moments/baking-8.jpg',
            '/moments/baking-9.jpg'
        ],
        location: '甜蜜时光烘焙工坊',
        likes: ['阿泽', 'Mia', '周南', 'Elon', '林夏'],
        comments: [
            { name: '周南', text: '最后一张翻车了吧哈哈哈' },
            { name: 'Cindy', text: '那是艺术！你不懂 😤', replyTo: '周南' },
        ],
    },

    // ============================================
    // 添加新动态模板（复制下面的对象，填写内容）
    // ============================================
    // {
    //   id: '7',  // 唯一ID，递增即可
    //   name: '你的昵称',
    //   avatar: '昵',  // 1-2个字的缩写
    //   avatarBg: '#颜色代码',  // 头像背景色
    //   avatarColor: '#颜色代码',  // 头像文字颜色
    //   time: '刚刚',  // 或 '10分钟前' / '昨天 12:30' 等
    //   text: '动态文字内容...',
    //   images: ['/moments/your-image-1.jpg'],  // 图片路径数组，最多9张
    //   location: '地点名称',  // 可选，不需要就留空字符串
    //   likes: ['用户A', '用户B'],  // 点赞列表
    //   comments: [
    //     { name: '用户A', text: '评论内容' },
    //     { name: '你的昵称', text: '回复内容', replyTo: '用户A' },
    //   ],
    // },
];
