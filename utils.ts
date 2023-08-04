import {Img} from './types.ts';
import { ensureFileSync } from "https://deno.land/std/fs/mod.ts"

// 获取月份
function month(n: number): string {
  const _date: Date = new Date()
  let month: number = _date.getMonth() + n
  if(month <= 0) {
    return `${_date.getFullYear() - 1}-${String(12).padStart(2, '0')}`
  }
  return `${_date.getFullYear()}-${String(month).padStart(2, '0')}`
}

// 更新数据及创建 readme 
export async function updateData(img: Img): Promise<void> {
  // 读取当月的 json 数据
  let data
  data = await ensureFileSync(`./data/${month(1)}.json`)
  data = await Deno.readTextFile(`./data/${month(1)}.json`)

  let prevData
  prevData = await ensureFileSync(`./data/${month(0)}.json`)
  prevData = await Deno.readTextFile(`./data/${month(0)}.json`)

  let flag = false

  if(data) {
    data = JSON.parse(data)
  } else {
    data = []
  }

  if(prevData) {
    prevData = JSON.parse(prevData)
  }  else {
    prevData = []
  }

  let resultData: Img[] = []

  if(!(data[0] && data[0].url == img.url)) {
    resultData.push(img)
    flag = true
  }

  resultData = resultData.concat(data || [])

  Deno.writeTextFile(`./data/${month(1)}.json`, JSON.stringify(resultData))

  let readme: string = ''

  readme = createReadme(resultData);

  let mainReadme = readme

  // 主页补全
  if(resultData.length < 30 && prevData.length) {
    const sliceLength = 30 - resultData.length
    const tempData = prevData.slice(0, sliceLength)
    // 创建每个月的 readme 时，通过 splice 会删除第一项，这里需要补充进去
    const temp = flag ? [img] : []
    resultData = temp.concat(resultData, tempData)
    mainReadme = createReadme(resultData);
  }

  let history = `
  
  ## HISTORY
  `

  // 这里是因为 deno 获取文件夹的顺序有问题，需要定义变量重新排序
  const tempDir = []

  for await (const fileOrFolder of Deno.readDir("./archive")) {
    tempDir.push(fileOrFolder.name)
  }
  tempDir.sort().reverse()
  tempDir.forEach((dirName, index) => {
    let suffix = index < tempDir.length - 1 ? '、' : ''
    history += `[${dirName}](https://github.com/Underglaze-Blue/bingwallpaper/tree/main/archive/${dirName}/) ${suffix}`
  })

  Deno.writeTextFile('./README.md', splicing('Bing Wallpaper', mainReadme, history))
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
