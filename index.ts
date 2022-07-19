import {Response, Img, Image} from './types.ts'
import {updateData} from './utils.ts'

const BING_URL = 'https://cn.bing.com'
const API_URL = `${BING_URL}/HPImageArchive.aspx?format=js&idx=0&n=1&nc=${+new Date()}&pid=hp&FORM=BEHPTB&uhd=1&uhdwidth=3840&uhdheight=2160`

const large = '&pid=hp&w=3840&h=2160&rs=1&c=4'
const medium = '&w=1000'
const small = '&pid=hp&w=384&h=216&rs=1&c=4'

const response = await fetch(API_URL);

if (!response.ok) {
  console.error(response.statusText);
  Deno.exit(-1)
}

const {images}: Response = await response.json();

const [image]: Image[] = images;

const { url, enddate, copyright, copyrightlink, title } = image;

// 图片地址
const fullUrl = `${BING_URL}${url.split("&")[0]}`;

// 图片的展示日期
const date = enddate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

const imgInfo: Img = {
  url: `${fullUrl}&pid=hp&w=3840&h=2160&rs=1&c=4`,
  preview: `${fullUrl}${small}`,
  large: `${fullUrl}${large}`,
  medium: `${fullUrl}${medium}`,
  copyright,
  date,
  title,
  copyrightlink
};

// 更新 README.md
await updateData(imgInfo);
