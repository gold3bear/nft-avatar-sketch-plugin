import UI from 'sketch/ui'
import DOM from 'sketch/dom'
import { getRandomSymbol, symbolsReplace } from './utils'
// documentation: https://developer.sketchapp.com/reference/api/

// 生成畫板
export function generateArtboard(layer, generateCount) {
  if (generateCount == 0) return;
  const { x, y, width, height } = layer.frame;
  const originName = layer.name;
  let offsetX = x, offsetY = y;
  const newLayers = [];
  for (let index = 0; index < generateCount; index++) {
    const duplicatedLayer = layer.duplicate();
    const replacedSymbols = symbolsReplace(duplicatedLayer.layers)
    // if (!Array.isArray(replacedSymbols)) continue;
    //重命名画布    
    const newName = replacedSymbols.reduce((prefix, symbolMaster, index) =>
      prefix + (index ? '&' : '?') + symbolMaster.name.replace('/', '=')
      , originName);
    //查找是否有重複畫布,如果有重複畫布則重新生成
    const checkDuplicatedLayers = DOM.find(`[name="${newName}"]`);
    if (checkDuplicatedLayers.length) {
      duplicatedLayer.remove();
      continue
    } else {
      duplicatedLayer.name = newName;
    }
    const countPerRow = 10;
    const colIndex = index % countPerRow;
    offsetX = x + (10 + width) * colIndex;
    const rowIndex = Math.floor(index / countPerRow) + 1;
    offsetY = y + (10 + height) * rowIndex;
    duplicatedLayer.frame.x = offsetX;
    duplicatedLayer.frame.y = offsetY;
    newLayers.push(duplicatedLayer)
  }
  return newLayers;
}

export default function () {
  //查看是否选中相关项目
  let currentDoc = DOM.getSelectedDocument();
  if (!currentDoc) currentDoc = DOM.getDocuments()[0]
  const selectedLayers = currentDoc.selectedLayers;
  //选择画板

  const { layers, length } = selectedLayers;
  if (length != 1) return UI.message("请选择1个画板");
  const layer = layers[0];
  if (layer.type != 'Artboard') return UI.message("请选择画板");

  //设置生成个数
  let generateCount = 10;
  UI.getInputFromUser("请填写你要生成的个数",
    { initialValue: generateCount },
    (err, generateCount) => {
      if (err) return;
      const startTime = Date.now();
      const newLayers = generateArtboard(layer, generateCount)
      selectedLayers.clear()
      // 选中
      if (newLayers.length <= 100) selectedLayers.layers = newLayers;
      currentDoc.centerOnLayer(newLayers[length-1]);
      const endTime = Date.now();
      const costTime = endTime - startTime;
      UI.message(`本次耗时${costTime / 1000}s,生成${newLayers.length}`)

    }
  )

}
