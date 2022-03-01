import sketch from 'sketch'
import dom from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/


const symbolsReplace = function (collections) {
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
        const randomIndex = Math.floor((Math.random() * length))
        const symbolToReplace = siblingSymbols[randomIndex];
        return symbolToReplace.symbolId ? symbolObj.symbolId = symbolToReplace.symbolId : null;
      } else {
        sketch.UI.message(`该${pathName}下只有1个${lastName}控件，无法连续替换`)
      }
    }

  })

}

export default function () {
  //查看是否选中相关项目
  let currentDoc = dom.getSelectedDocument() ;
  if(!currentDoc) currentDoc = dom.getDocuments()[0]
  const selectedLayers = currentDoc.selectedLayers  //返回一个set对象
  const selectedCount = selectedLayers.length
  if (selectedCount === 0) {
    return sketch.UI.message("请选择控件或者含有控件的画板")
  } else {
    return symbolsReplace(selectedLayers)
  }

}
