import sketch from 'sketch'
import dom from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/

export default function () {
  //查看是否选中相关项目
  const currentDoc = dom.getSelectedDocument();
  const selectedLayers = currentDoc.selectedLayers  //返回一个set对象
  const selectedCount = selectedLayers.length
  if (selectedCount === 0) {
    return sketch.UI.message("请选择相应组件元素")
  }
  // 处理选中的控件
  selectedLayers.forEach(function (symbolObj, i) {
    if (symbolObj.type !== 'SymbolInstance') {
      return  sketch.UI.message(symbolObj.name + '需要选中元素是控件实例，才能被替换.')
    }
    //找到组件原生体 symbolMaster
    // console.log('symbolMaster',symbolObj.master)
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
      sketch.UI.message(`该${pathName}下只有1个${lastName}，无法替换`)
    }

  })







}
