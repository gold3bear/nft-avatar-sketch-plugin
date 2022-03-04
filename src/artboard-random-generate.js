import sketch from 'sketch'
import dom from 'sketch/dom'
import  {getRandomSymbol,symbolsReplace} from './utils'
// documentation: https://developer.sketchapp.com/reference/api/


export default function () {
  //查看是否选中相关项目
  let currentDoc = dom.getSelectedDocument();
  if (!currentDoc) currentDoc = dom.getDocuments()[0]
  const selectedLayers = currentDoc.selectedLayers;
  //选择画板
  const {layers} = selectedLayers;
  //todo:设置生成个数 1000 每行20个
  layers.forEach(layer => {
    const duplicatedLayer =  layer.duplicate();
    const {x,y,width,height} = duplicatedLayer.frame;
    duplicatedLayer.frame.x = x+width+10;
    return symbolsReplace(duplicatedLayer.layers)
  });
 
 
  //创建随机画板

}
