<template>
  <div ref="treeGraph"></div>
</template>

<script>
import resize from '@/mixins/resize';
import echarts from 'echarts';

export default {
  name: 'treeGraph',
  mixins: [resize],
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.initEchart();
    });
  },
  methods: {
    initEchart() {
      this.myChart = echarts.init(this.$refs.treeGraph);
      this.myChart.setOption(
        {
          tooltip: {
            show: false
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              force: {
                //在每两个节点之间添加一个斥力
                repulsion: 1600, //节点之间的斥力因子。
                edgeLength: 200 //边的两个节点之间的距离
              },
              roam: true, //是否开启鼠标缩放和平移漫游
              draggable: true, //节点是否可拖拽，只在使用力引导布局的时候有用。
              symbolSize: 80, //节点标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
              focusNodeAdjacency: true,
              edgeLabel: {
                normal: {
                  show: true, //是否显示标签。
                  textStyle: {
                    fontSize: 16 //标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行。
                  },
                  formatter(x) {
                    //标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行。
                    return x.data.name;
                  }
                }
              },
              edgeSymbol: ['', 'arrow'], //边两端的标记类型，可以是一个数组分别指定两端，也可以是单个统一指定。默认不显示标记，常见的可以设置为箭头
              label: {
                //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。
                show: false //是否显示标签。
              },
              itemStyle: {
                normal: {
                  shadowColor: 'rgba(133,203,247,0.75)',
                  shadowBlur: 15
                }
              },
              label: {
                normal: {
                  show: false
                }
              },
              links: [
                {
                  source: '娜美',
                  target: '路飞',
                  name: '航海士',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '索隆',
                  target: '路飞',
                  name: '剑士',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '乌索普',
                  target: '路飞',
                  name: '狙击手',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '山治',
                  target: '路飞',
                  name: '厨师',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '乔巴',
                  target: '路飞',
                  name: '医生',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '罗宾',
                  target: '路飞',
                  name: '学者',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '弗兰奇',
                  target: '路飞',
                  name: '修船工',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '布鲁克',
                  target: '路飞',
                  name: '音乐家',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '甚平',
                  target: '路飞',
                  name: '掌舵手',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '龙',
                  target: '路飞',
                  name: '父亲',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '卡普',
                  target: '路飞',
                  name: '爷爷',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '雷利',
                  target: '路飞',
                  name: '师傅',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '艾斯',
                  target: '路飞',
                  name: '哥哥',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '萨博',
                  target: '路飞',
                  name: '哥哥',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '女帝',
                  target: '路飞',
                  name: '爱慕',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '罗',
                  target: '路飞',
                  name: '同盟',
                  lineStyle: {
                    color: '#006acc'
                  }
                },
                {
                  source: '路飞',
                  target: '草帽大船团',
                  name: '船长',
                  lineStyle: {
                    color: '#ff7d18'
                  }
                }
              ],
              data: [
                {
                  name: '路飞',
                  symbolSize: 110,
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70789.gif'
                },
                {
                  name: '娜美',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70813.gif'
                },
                {
                  name: '索隆',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70823.gif'
                },
                {
                  name: '乌索普',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70816.gif'
                },
                {
                  name: '山治',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70810.gif'
                },
                {
                  name: '乔巴',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/62898.gif'
                },
                {
                  name: '罗宾',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70815.gif'
                },
                {
                  name: '弗兰奇',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70886.gif'
                },
                {
                  name: '布鲁克',
                  symbol: 'image://' + require('../../../../assets/graph/blk.jpg')
                },
                {
                  name: '甚平',
                  symbol: 'image://' + require('../../../../assets/graph/shenping.jpg')
                },
                {
                  name: '龙',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70807.gif'
                },
                {
                  name: '卡普',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70808.gif'
                },
                {
                  name: '雷利',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70878.gif'
                },
                {
                  name: '艾斯',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/62719.gif'
                },
                {
                  name: '萨博',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70818.gif'
                },
                {
                  name: '女帝',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70858.gif'
                },
                {
                  name: '罗',
                  symbol: 'image://' + 'http://www.xinziyun.com.cn/img/hex/70859.gif'
                },
                {
                  name: '草帽大船团',
                  symbol: 'image://' + require('../../../../assets/graph/big.jpg')
                }
              ]
            }
          ],
          animationDurationUpdate: index => {
            return index * 100;
          },
          animationEasingUpdate: 'bounceIn'
        },
        true
      );
    }
  }
};
</script>
