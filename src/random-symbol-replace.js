import sketch from 'sketch'
import dom from 'sketch/dom'
import  {symbolsReplace} from './utils'
// documentation: https://developer.sketchapp.com/reference/api/


export default function () {
  //查看是否选中相关项目
  let currentDoc = dom.getSelectedDocument();
  if (!currentDoc) currentDoc = dom.getDocuments()[0]
  const selectedLayers = currentDoc.selectedLayers  //返回一个set对象
  const selectedCount = selectedLayers.length
  if (selectedCount === 0) {
    return sketch.UI.message("请选择控件或者含有控件的画板")
  } else {
    return symbolsReplace(selectedLayers)
  }

}
