import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts')
console.log('process.cwd()', process.cwd());
// /Users/johnahn/Downloads/next-typescript
console.log('postDirectory', postsDirectory);
// /Users/johnahn/Downloads/next-typescript/posts

export function getSortedPostsData() {
  // Get file names under /posts
  // /posts 파일 이름을 잡아주기
  const fileNames = fs.readdirSync(postsDirectory)
  console.log('fileNames', fileNames);
  // filtNames [ 'pre-rendering.md', 'ssg-ssr.me' ]
  const allPostsData = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf-8');

    // Use gray-matter to parse the post matadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data as { date: string; title: string }
    }
  })
  
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id: string) {
  // 파일 경로에서 파일명 추출
  const fullPath = path.join(postsDirectory, `${id}.md`)
  // markdown 파일을 utf-8로 읽어온다
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  // markdown 내용을 데이터 형태로 변환
  const matterResult = matter(fileContents);

  // html string으로 변환
  const processedContent = await remark()
    .use(remarkHtml)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string;  title: string})
  }
}