import { set } from 'vue/types/umd';
import remoteLoad from './remoteLoad';
const { AMapCDN, AMapUiCDN } = require('@/plugins/cdn');

/**
 * 用于将地址后面的参数转换成对象返回
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {number} delay
 * @param {boolean} immediate
 * @return {*}
 */
// 做一段时间的延时才执行
export function debounce(func, delay, immediate = false) {
  let timer, // 闭包记录timer变量
    context = this;
  return (...args) => {
    if (immediate) {
      func.apply(context, args);
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}
// 使用定时器,定时一秒之后再去执行
export function throttle(func, delay) {
  let timer, // 闭包记录timer变量
    context = this;
  return (...args) => {
    if (timer) return; //判断如果有计时器不清零直接返回啥也不做
    timer = setTimeout(() => {
      func.apply(context, args);
      timer = null;
    }, delay);
  };
}
// const throttle = (handler, time) => {
//   let t
//   return () => {
//       let _self = this //取throttle 执行作用域的this
//       let _arg = arguments //利用闭包保存参数数组
//       if (!t || Date.now() - t >= time ) {
//           handler.apply(_self , _arg );
//           t = Date.now(); //得到的当前时间戳
//       }
//   }
// }

/**
 * 获取geoJson数据  通过高德获取    递归获取区县geoJson
 * @param  {string} adcode  行政区code
 * @param  {string} childAdcode 区县级行政区code
 * @return {Array}
 */
export function getGeoJson(adcode, childAdcode = '') {
  return new Promise((resolve, reject) => {
    if (window.AMap && window.AMapUI) {
      insideFun(adcode, childAdcode);
    } else {
      remoteLoad(AMapCDN).then(() => {
        if (window.AMap) {
          remoteLoad(AMapUiCDN).then(() => {
            if (window.AMapUI) {
              insideFun(adcode, childAdcode);
            } else {
              console.error('AMapUI获取失败');
            }
          });
        } else {
          console.error('AMap获取失败');
        }
      });
    }
    function insideFun(adcode, childAdcode) {
      // eslint-disable-next-line
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        var districtExplorer = new DistrictExplorer();
        districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          if (Json.length === 0) {
            let parent = areaNode._data.geoData.parent.properties.acroutes;
            insideFun(parent[parent.length - 1], adcode);
            return;
          }

          if (childAdcode) {
            Json = Json.filter(item => {
              return item.properties.adcode == childAdcode;
            });
          }
          let mapJson = {
            features: Json
          };
          resolve(mapJson);
        });
      });
    }
  });
}

/**
 * 转换JSON  导出
 * @param  {Array}
 * @return {Array}
 */

export function formatJson(arr, filterVal) {
  return arr.map(v => filterVal.map(j => v[j].toString()));
}
