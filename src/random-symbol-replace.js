import sketch from 'sketch'
import dom from 'sketch/dom'
// documentation: https://developer.sketchapp.com/reference/api/

export default function() {
  //判断用户输入元素

// console.log('random-symbol-replace',sketch,) // sketch is import
// console.log('random-symbol-replace 2',context) //context Is global
// console.log('random-symbol-replace 3',dom) //context Is global
//查看是否选中相关项目
const currentDoc = dom.getSelectedDocument();
// console.log('random-symbol-replace 4',currentDoc);
const selectedLayers = currentDoc.selectedLayers  //返回一个set对象
const selectedCount = selectedLayers.length
if(selectedCount){

  selectedLayers.forEach(function (symbolObj, i) {
    // console.log((i + 1) + '. ' + symbolObj.name,symbolObj)
    if(symbolObj.type !=='SymbolInstance' ){
      sketch.UI.message(symbolObj.name+'需要选中元素是控件实例，才能被替换.')
      return
    }
    //找到组件原生体 symbolMaster
    // console.log('symbolMaster',symbolObj.master)
    const {master:symbolMaster, symbolId} = symbolObj;
    const fullName = symbolMaster.name;

    //找到命名空间下的兄弟组件
    //1.获得名字和命名空间
    const nameArray =  fullName.split('/');
    const lastName = nameArray.pop();
    const pathName = nameArray.join('/')+'/';
    // console.log('symbolNamespace',nameArray,lastName,pathName)
    //2.查找兄弟控件
    const siblingSymbols = dom.find(`SymbolMaster,[name^="${pathName}"]`);
    //剔除掉自己
    const symbolIndex = siblingSymbols.findIndex(symbol=>symbol.symbolId ===symbolId)
    siblingSymbols.splice(symbolIndex,1)
    // console.log('siblingSymbols',symbolIndex,symbolId,siblingSymbols)
    
    //对当前的控件进行随机替换操作
    const {length} =  siblingSymbols;
    const randomIndex = Math.floor((Math.random()*length))
   
    const symbolToReplace= siblingSymbols[randomIndex];
    const newSymbolId =  symbolToReplace.symbolId;
    symbolObj.symbolId = newSymbolId;
    console.log('newSymbolId',symbolToReplace,randomIndex,newSymbolId)
    sketch.UI.message(`randomIndex${randomIndex}:${newSymbolId}`)
  })




}else{
  sketch.UI.message("请选择相应组件元素")
}





 
}
