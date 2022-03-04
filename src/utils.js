import sketch from 'sketch'
import dom from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/

export function getRandomSymbol (symbols) {
  const {length} = symbols;
  const randomIndex = Math.floor(( Math.random() * length))
  const symbol = symbols[randomIndex]; //第一次随机命中控件

  //如控件名字“body/5@0.5” @0.5是稀缺值
  //根据命中控件稀缺性再计算随机一次，降低稀有控件的出现概率
  //1. 从名字中获得组件稀缺值
  let probability = 1;//默认是1，必然出现
  const scarcity = symbol.name.match(/@\d+(\.\d+)$/);
  if(scarcity) probability = parseFloat(scarcity[1]);

  //2.根据命中控件稀缺值再随机一次
  if (Math.random() <= probability) {
    if(scarcity){
      sketch.UI.message(`命中稀缺控件${symbol.name},出现概率${1/(length+1)*probability}`)
    }
    return symbol;
  } else {
    //未命中再来一次
    return getRandomSymbol(symbols)
  }
}

export function symbolsReplace (collections) {
  // 处理选中的控件
  const collectionsCount = collections.length
  if (collectionsCount === 0) return;

  collections.forEach(function (symbolObj, i) {
    //判断选择类型，如果是symbol则直接替换, 如果是Layer是画板 则替换画板内的symbol
    if (symbolObj.type === 'Artboard' || symbolObj.type === 'Group') {
      const { layers } = symbolObj
      return symbolsReplace(layers)
    }
    if (symbolObj.type === 'SymbolInstance') {
      //找到组件原生体 symbolMaster
      const { master: symbolMaster, symbolId } = symbolObj;
      const fullName = symbolMaster.name;
      //例如：body/5@0.5 “/”是命名空间的分组，@0.5是稀缺性，在随机个数之上再乘以0.5的稀缺性系数
      //找到命名空间下的兄弟组件
      //1.获得名字和命名空间
      //2.查找兄弟控件
      const nameArray = fullName.split('/');
      const lastName = nameArray.pop();
      const pathName = nameArray.join('/') + '/';
      const siblingSymbols = dom.find(`SymbolMaster,[name^="${pathName}"]`);
      const symbolIndex = siblingSymbols.findIndex(symbol => symbol.symbolId === symbolId)
      siblingSymbols.splice(symbolIndex, 1)

      //对当前的控件进行随机替换操作
      const { length } = siblingSymbols;
      if (length > 0) {
        const symbolToReplace = getRandomSymbol(siblingSymbols);
        return symbolObj.symbolId = symbolToReplace.symbolId
      } else {
        console.log(`该${pathName}下只有1个${lastName}控件，无法连续替换`)
      }
    }

  })

}

export default {
    symbolsReplace,
    getRandomSymbol
}
