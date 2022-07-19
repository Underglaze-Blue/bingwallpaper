import {Img} from './types.ts';
import { ensureFileSync } from "https://deno.land/std/fs/mod.ts"

// 获取月份
function month(n: number): string {
  const _date: Date = new Date()
  let month: number = _date.getMonth() + n
  return `${_date.getFullYear()}-${month}`
}

// 更新数据及创建 readme 
export async function updateData(img: Img): Promise<void> {
  // 读取当月的 json 数据
  let data
  data = await ensureFileSync(`./data/${month(1)}.json`)
  data = await Deno.readTextFile(`./data/${month(1)}.json`)

  if(data) {
    data = JSON.parse(data)
  }

  let resultData: Img[] = []

  resultData.push(img)

  resultData = resultData.concat(data || [])

  Deno.writeTextFile(`./data/${month(1)}.json`, JSON.stringify(resultData))

  let readme: string = ''

  readme = createReadme(resultData);

  Deno.writeTextFile('./README.md', splicing('Bing Wallpaper', readme))
  await ensureFileSync(`./archive/${month(1)}/README.md`)
  Deno.writeTextFile(`./archive/${month(1)}/README.md`, splicing(month(1), readme))
}

// 拼接
function splicing(str: string, readme: string):string {
  return `## ${str}` + readme
}

// 创建 readme
function createReadme(data: Img[]): string {
  const [first]: Img[] = data.splice(0, 1)
  let str = `
---
[![${first.copyright}](${first.medium})](${first.large})

Today: [${first.copyright}](${first.large})
  `

  let fragment = `|      |      |      |
| :----: | :----: | :----: |
`

  data.forEach((item, index) => {
      fragment += `| ![${item.title}](${item.preview}) <br/> ${item.date}  [download 4K](${item.large})`
      if(index > 0 && index % 3 === 0) {
        fragment += `|
`
      }
  });

  fragment += ' |'

  return str + (data.length ? fragment : '')
}
