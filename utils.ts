import {Img} from './types.ts';
import { ensureFileSync } from "https://deno.land/std/fs/mod.ts"

// 获取月份
function month(n: number): string {
  const _date: Date = new Date()
  let month: number = _date.getMonth() + n
  return `${_date.getFullYear()}-${String(month).padStart(2, '0')}`
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

  let history = `
  
  ## HISTORY
  `
  for await (const fileOrFolder of Deno.readDir("./archive")) {
    console.log(fileOrFolder);
    history += `[${fileOrFolder.name}](https://github.com/Underglaze-Blue/bingwallpaper/tree/main/archive/${fileOrFolder.name}/) 、`
  }

  Deno.writeTextFile('./README.md', splicing('Bing Wallpaper', readme, history))
  await ensureFileSync(`./archive/${month(1)}/README.md`)
  Deno.writeTextFile(`./archive/${month(1)}/README.md`, splicing(month(1), readme, ''))
}

// 拼接
function splicing(str: string, readme: string, other?: string):string {
  return `## ${str}` + readme + other
}

// 创建 readme
function createReadme(data: Img[]): string {
  const [first]: Img[] = data.splice(0, 1)
  let str = `
[![${first.copyright}](${first.medium})](${first.large})

Today: [${first.copyright}](${first.large})
  `

  let fragment = `|      |      |      |
| :----: | :----: | :----: |
`

  data.forEach((item, index) => {
      fragment += `| ![${item.title}](${item.preview}) <br/> ${item.title} <br/> ${item.date}  [download 4K](${item.large})`
      if(index > 0 && (index + 1) % 3 === 0) {
        fragment += `|
`
      }
  });

  if(data.length % 3 !== 0) {
    fragment += ' |'
  }


  return str + (data.length ? fragment : '')
}
