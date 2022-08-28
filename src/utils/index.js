import remoteLoad from './remoteLoad';
const { AMapCDN, AMapUiCDN } = require('@/plugins/cdn');
import router from '@/router';
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

/**
 * requestAnimationFrame兼容处理
 *
 *
 */

export const raf = (function(r) {
  if (r) {
    return r;
  } else {
    let lastTime = 0;
    return function(callback, element) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
      let id = window.setTimeout(() => {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
})();
/**
 * cancelAnimationFrame兼容处理
 *
 *
 */

export const caf = (function(c) {
  if (c) {
    return c;
  } else {
    return function(id) {
      clearTimeout(id);
    };
  }
})();
let _leaveConfirmVm = null;
export default {
  deeGet: deeGet,
  /**
   * 离开页面二次确认
   */
  leaveConfirm(
    vm,
    fn = () => {
      return false;
    },
    tip = '当前页面数据未保存,确定离开?'
  ) {
    _leaveConfirmVm = vm;
    vm.$on('hook:updated', () => {
      window.onbeforeunload = function(event) {
        if (fn(vm)) {
          event = event || window.event;
          if (event) {
            event.preventDefault();
            event.returnValue = '关闭提示';
          }
          return '关闭提示';
        } else {
          return null;
        }
      };
    });
    // 组件销毁后移除onbeforeunload 事件
    vm.$once('hook:beforeDestroy', () => {
      window.onbeforeunload = null;
      router.beforeResolve = () => {
        _leaveConfirmVm = {};
      };
    });

    router.beforeResolve((to, from, next) => {
      if (fn(_leaveConfirmVm)) {
        const answer = window.confirm(tip);
        answer ? next() : next(false);
      } else {
        next();
      }
    });
  },

  // 判断元素是否在可视区内
  isInViewport(el, target) {
    if (el) {
      let rect = el.getBoundingClientRect();
      if (target) {
        let tRect = target.getBoundingClientRect();
        return rect.top >= tRect.top && rect.bottom <= tRect.bottom;
      } else {
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0;
      }
    }
  },
  // 对象数组去重
  deDuplication(list, dataIndex) {
    let obj = {};
    return list.reduce(function(arr, next) {
      obj[deeGet(next, dataIndex)] ? '' : obj[deeGet(next, dataIndex)] && arr.push(next);
      return arr;
    }, []);
  }
};
// 深度遍历去对象值
function deeGet(obj, keys, defaultValue) {
  return (
    (!Array.isArray(keys)
      ? keys
          .replace(/\[/g, '.')
          .replace(/\]/g, '')
          .split('.')
      : keys
    ).reduce((o, k) => (o || {})[k], obj) ||
    defaultValue ||
    ''
  );
}
