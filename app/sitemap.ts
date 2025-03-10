export default function sitemap() {
  return [
    {
      url: 'https://myambience.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // 添加其他页面的 URL
  ]
}