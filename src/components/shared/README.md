# Shared Components

本目录存放跨页面/布局复用的通用组件。

## Social
渲染社交媒体图标与链接。

**Props**
- `links?: Array<{ href: string; label: string; icon: 'twitter' | 'youtube' | 'facebook' }>`

**示例**
```astro
<Social
  links={[
    { href: 'https://twitter.com', label: 'Twitter', icon: 'twitter' },
    { href: 'https://www.youtube.com', label: 'YouTube', icon: 'youtube' },
  ]}
/>
```

## Footer
站点页脚，支持自定义导航与社交链接。

**Props**
- `primaryLinks?: Array<{ label: string; href: string }>`
- `projectLink?: { label: string; href: string }`
- `socialLinks?: Array<{ href: string; label: string; icon: 'twitter' | 'youtube' | 'facebook' }>`

**示例**
```astro
<Footer
  primaryLinks={[
    { label: 'About', href: '/about/' },
    { label: 'Blog', href: '/blog/' },
  ]}
  projectLink={{ label: 'Project', href: 'https://example.com' }}
  socialLinks={[
    { href: 'https://twitter.com', label: 'Twitter', icon: 'twitter' },
  ]}
/>
```

## ThemeToggle
主题切换开关，默认存储键 `theme`，写入 `data-theme`。

**Props**
- `id?: string`
- `ariaLabel?: string`
- `storageKey?: string`

**示例**
```astro
<ThemeToggle id="mainThemeToggle" storageKey="theme" />
```
