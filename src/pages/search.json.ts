import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const items = [
    { title: 'Home', url: '/' },
    { title: 'Blog', url: '/blog/' },
    { title: 'About', url: '/about/' },
    { title: 'Tags', url: '/tags/' },
  ];

  posts.forEach((post) => {
    const tags = Array.isArray(post.data.tags) ? post.data.tags : [];
    const description = post.data.description ?? post.data.summary ?? '';
    items.push({
      title: post.data.title ?? post.slug,
      url: `/posts/${post.slug}/`,
      description,
      tags,
    });
  });

  return new Response(JSON.stringify({ items }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
