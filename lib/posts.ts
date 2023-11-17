import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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