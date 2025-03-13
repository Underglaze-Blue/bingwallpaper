import {Response, Img, Image} from './types.ts'
import {updateData} from './utils.ts'

const BING_URL = 'https://cn.bing.com'
// const API_URL = `${BING_URL}/HPImageArchive.aspx?format=js&idx=0&n=1&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160`
const API_URL = `${BING_URL}/hp/api/model?mkt=zh-CN&FORM=JSON`

const large = '&pid=hp&w=3840&h=2160&rs=1&c=4'
const medium = '&w=1000'
const small = '&pid=hp&w=384&h=216&rs=1&c=4'

const response = await fetch(API_URL);

if (!response.ok) {
  console.error(response.statusText);
  Deno.exit(-1)
}

const {MediaContents}: Response = await response.json();

const [temp] = MediaContents

const {ImageContent} = temp

// const [image]: Image[] = ImageContent;

// const { url, enddate, copyright, copyrightlink, title } = image;

let tempImgUrl = ImageContent?.Image?.Wallpaper
tempImgUrl = tempImgUrl.split('&')[0]

// 图片地址
const fullUrl = `${BING_URL}${tempImgUrl}`;
// const fullUrl = `${BING_URL}${url.split("&")[0]}`;

// 图片的展示日期
const date = ImageContent.TriviaId.replace(/\D/g, '').replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

const imgInfo: Img = {
  url: `${fullUrl}&pid=hp&w=3840&h=2160&rs=1&c=4`,
  preview: `${fullUrl}${small}`,
  large: `${fullUrl}${large}`,
  medium: `${fullUrl}${medium}`,
  copyright: ImageContent.Copyright,
  date,
  title: ImageContent.Title,
  copyrightlink: ImageContent.TriviaUrl
};

// 更新 README.md
await updateData(imgInfo);
