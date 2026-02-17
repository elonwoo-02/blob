# Blog页面布局修改总结

## 目标
修改blog页面的sidebar和main content布局，使其：
1. **默认状态**：sidebar（320px）和main-content并排紧靠，整体在BaseLayout中居中
2. **点击drawer toggle时**：sidebar向左收缩隐藏，main-content自动向左扩大

## 修改概览

### 1. **blog.astro** - 页面结构
- **之前**：BlogDrawerSidebar 使用 fixed 定位（脱离正常流），sidebar 初始 margin-left: -320px（隐藏）
- **之后**：
  - 创建 `blog-wrapper` 容器（`flex justify-center`）包含sidebar和main-content
  - BlogDrawerSidebar 作为flex子项（相对定位，不再fixed）
  - main-content 包含所有article/moment视图
  - 整个wrapper作为BaseLayout的slot内容，一起居中

#### 布局代码
```astro
<BaseLayout pageTitle={pageTitle}>
  <div id="blog-wrapper" class="flex justify-center">
    <!-- Sidebar: 320px固定宽度 -->
    <BlogDrawerSidebar ... />
    
    <!-- Main Content: 宽度由内部内容决定 -->
    <div id="main-content" class="blog-page blog-page--index-theme relative min-w-0">
      <DrawerToggle />
      <ArticleView ... />
      <div id="moment-view" ...>
        <MomentView />
      </div>
    </div>
  </div>
</BaseLayout>
```

### 2. **BlogDrawerSidebar.astro** - Sidebar布局
- **之前**：`fixed top-0 left-0` + `margin-left: -320px`（初始隐藏）
- **之后**：
  - 移除 `fixed` 定位，改为流布局（flex子项）
  - 添加 `flex-shrink-0` 防止缩小
  - 默认 `width: 320px`，隐藏时 `width: 0`
  - 添加 `overflow: hidden` 确保宽度变化时内容不可见
  - `margin-right` 用于配合 `width` 的过渡动画

#### 初始样式
```astro
<aside
  id="drawer-sidebar"
  class="drawer-sidebar h-screen bg-base-100 flex-shrink-0"
  style="width: 320px; margin-right: 0; overflow: hidden; transition: width 500ms, margin-right 500ms;"
>
  <div class="drawer-content flex flex-col h-full overflow-y-auto">
    <!-- 内容 -->
  </div>
</aside>
```

#### JavaScript逻辑
```javascript
let isOpen = true;  // 默认打开

function toggleDrawer() {
  isOpen = !isOpen;
  
  if (isOpen) {
    drawer.style.width = "320px";
    drawer.style.marginRight = "0";
  } else {
    drawer.style.width = "0";
    drawer.style.marginRight = "-320px";
  }
  
  // 派发事件给main-content
  window.dispatchEvent(new CustomEvent("drawer-state-changed", {
    detail: { isOpen }
  }));
}
```

### 3. **ArticleView.astro** - 内容宽度
- **之前**：`max-w-2xl mx-auto`（直接在article-view元素上）
- **之后**：
  - article-view 添加 `w-full` 使其占据main-content宽度
  - section 添加 `max-w-2xl mx-auto`（内部内容限制）
  - JavaScript动态调整 section 的 max-width

#### 初始样式
```astro
<div id="article-view" class="view-content relative z-10 pb-20 w-full">
  <section class="mt-4 space-y-6 max-w-2xl mx-auto">
    <!-- 内容 -->
  </section>
</div>
```

### 4. **DrawerToggle.astro** - 切换按钮位置
- **之前**：`fixed top-4 left-4 z-50`（固定在视口左上角）
- **之后**：
  - 改为 `absolute top-4 left-4 z-10`（相对于main-content定位）
  - main-content 需要 `relative` 定位支持

### 5. **blog.astro** - JavaScript逻辑
添加 drawer-state-changed 事件监听器，动态调整section的max-width：

```javascript
window.addEventListener("drawer-state-changed", (event) => {
  const { isOpen } = event.detail;
  const articles = document.querySelectorAll('#article-view section, #moment-view section');
  
  articles.forEach(section => {
    if (isOpen) {
      // sidebar显示时：保持max-w-2xl (42rem)
      section.style.maxWidth = '42rem';
    } else {
      // sidebar隐藏时：扩展以填补sidebar空间
      section.style.maxWidth = 'calc(42rem + 320px)';
    }
  });
});
```

## 动画流程

### 打开状态 → 隐藏状态
1. **Sidebar**
   - `width: 320px → 0` (500ms)
   - `margin-right: 0 → -320px` (500ms)
   - flex容器自动缩小

2. **Main-content**
   - 自动从右向左扩展（flex布局自动调整）

3. **内容Section**
   - `max-width: 42rem → calc(42rem + 320px)` (JavaScript触发)

4. **整体Wrapper**
   - 保持在viewport中心
   - 总宽度从 `640px` 减少到 `calc(42rem + 320px)`
   - 但因为wrapper使用 `justify-center`，会自动重新居中

## 关键CSS类和样式

| 元素 | 类 | 作用 |
|------|-----|------|
| blog-wrapper | `flex justify-center` | 使sidebar和main-content一起居中 |
| drawer-sidebar | `flex-shrink-0` | 防止sidebar在flex容器中被压缩 |
| drawer-sidebar | `overflow: hidden` | 隐藏超出宽度的内容 |
| drawer-content | `overflow-y-auto` | 内部滚动 |
| main-content | `relative min-w-0` | 支持absolute子元素定位，防止内容溢出 |
| article-view | `w-full` | 占据main-content宽度 |

## 浏览器兼容性
- 使用 `flex` 布局（现代浏览器支持）
- CSS transition 动画
- JavaScript CustomEvent
- 所有现代浏览器均支持

## 测试建议
1. 默认加载 - 确认sidebar和main-content并排且整体居中
2. 点击drawer toggle - sidebar平滑收缩，main-content平滑扩大
3. 再次点击 - sidebar平滑展开，main-content平滑缩小
4. 调整窗口大小 - 内容应保持居中
5. 切换Article/Moment视图 - 动画应该也生效

