console.log('falci.js loaded')

falci = {}

falci.ui = async (div = document.getElementById('falciDiv')) => {
  if (typeof (div) == 'string') {
    div = document.getElementById('falciDiv')
  }
  if (!div) {
    console.warn('target div not found')
  } else {
    falci.div = div
  }

  // membrane pore bound by two aminoacid strands
  // TM (23 aa) and TM9 (17)
  let TM2n = 23,
    TM9n = 17,
    n = TM2n + TM9n
  let tb0 = document.createElement('table')
  tb0.align = 'center'
  tb0.id = "TMtb"
  div.appendChild(tb0)
  tb0.innerHTML = `<tr><td align="center">TM2</td><td><i style="color:blue">* wild type</i></td><td align="center">TM9</td></tr>
                   <tr><td id="TM2td" style="background-color:silver"></td><td id="poretd"></td><td id="TM9td" style="background-color:silver"></td></tr>`
  let TM2tb = document.createElement('table')
  let TM9tb = document.createElement('table')
  TM2td.appendChild(TM2tb)
  TM9td.appendChild(TM9tb)
  // build TM table
  let TMhtml = (i0, n) => {
    let h = ''
    for (var i = i0; i <= n; i++) {
      if (i <= 23) {
        j = i + 89 // first pos of TM2 is 90
      } else {
        j = i + 342 - 23 // first pos of TM9 is 343
      }
      h += `<tr><td id="TMi_${i}" class="aatd"><sup>${j} </sup></td></tr>`
    }
    //console.log(h)
    return h
  }
  TM2tb.innerHTML = TMhtml(1, TM2n)
  TM9tb.innerHTML = TMhtml(TM2n + 1, TM2n + TM9n)
  // populate aminoacid input

  falci.aa = ["A", "R", "N", "D", "C", "Q", "E", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V"]
  falci.mapping = {}
  let aaAbr = ["Ala", "Arg", "Asn", "Asp", "Cys", "Gln", "Glu", "Gly", "His", "Ile", "Leu", "Lys", "Met", "Phe", "Pro", "Ser", "Thr", "Trp", "Tyr", "Val"]
  let aaName = ["Alanine", "Arginine", "Asparagine", "Aspartic acid", "Cysteine", "Glutamine", "Glutamic acid", "Glycine", "Histidine", "Isoleucine", "Leucine", "Lysine", "Methionine", "Phenylalanine", "Proline", "Serine", "Threonine", "Tryptophan", "Tyrosine", "Valine"]
  let wildType = ["S", "F", "V", "T", "S", "E", "T", "H", "N", "F", "I", "C", "M", "I", "M", "F", "F", "I", "V", "Y", "S", "L", "F", "M", "T", "Y", "T", "I", "V", "S", "C", "I", "Q", "G", "P", "A", "L", "A", "I", "A"]
  document.body.querySelectorAll('.aatd').forEach((td, j) => {
    let sel = document.createElement('select')
    falci.aa.forEach((a, i) => {
      falci.mapping[a] = i
      let op = document.createElement('option')
      sel.appendChild(op)
      op.value = a
      op.text = `${a} (${aaAbr[i]})`
      if (op.value == wildType[j]) {
        op.text += '*'
      }
    })
    sel.value = wildType[j]
    td.appendChild(sel)
  })
  // look for run parameters
  falci.runParms()
}

falci.runParms = async () => {
  if (location.hash.length > 5) {
    let parms = {}
    location.hash.slice(1).split('&').forEach(r => {
      let rr = r.split('=')
      parms[rr[0]] = rr[1]
      falci.parms = parms
    })
    if (falci.parms.refdata) {
      let txt = await (await fetch(falci.parms.refdata)).text()
      falci.csvTab = txt.split(/\n+/g).map(r => {
        return r.split(',')
      })
      falci.pre = document.createElement('pre')
      falci.pre.innerHTML = txt
      falci.div.appendChild(document.createElement('hr'))
      falci.TFdiv = document.createElement('div')
      falci.div.appendChild(falci.TFdiv)
      falci.div.appendChild(document.createElement('hr'))
      falci.div.appendChild(falci.pre) // plain display of the raw reference data
      // time for Tensor flow
      falci.tf()
    }
  }
}

const convertLabelsToInts = (labelsList) => labelsList.map(label => falci.mapping[label])

const oneHotEncodeRow = (row) => {
  const convertedLabels = convertLabelsToInts(row)
  const oneHotEncodedRow = tf.oneHot(convertedLabels, falci.aa.length)
  return oneHotEncodedRow
}

const onEpochEnd = (epoch, logs) => {
  console.log(`Logs after epoch ${epoch+1}:`)
  console.log(`Loss ${falci.parms.loss || "meanSquaredError"}: `, logs.loss)
  console.log("------------------------------------------------")
}
const onTrainEnd = () => {
  console.log("Finished training!")
}

falci.tf = async (div = falci.TFdiv) => {
  // wrangle the data
  const arch = (falci.parms.arch && eval(falci.parms.arch).length >= 3) ? eval(decodeURIComponent(falci.parms.arch)) : [20, 10, 6]
  const optimizer = falci.parms.optimizer || "adam"
  const loss = falci.parms.loss || "meanSquaredError"
  const metrics = "mse"
  const validationSplit = falci.parms.validationSplit ? parseFloat(falci.parms.validationSplit) : 0.15
  const batchSize = falci.parms.batchSize ? parseInt(falci.parms.batchSize) : 5
  const epochs = falci.parms.epochs ? parseInt(falci.parms.epochs) : 20

  const setupModel = () => tf.tidy(() => {
    const rawTrainingData = falci.csvTab.slice(1).map(r => r.slice(1, -1))
    let encodedTrainingData = rawTrainingData.map(row => tf.tidy(() => oneHotEncodeRow(row)))
    encodedTrainingData = tf.stack(encodedTrainingData)
    let y = tf.tensor1d(falci.csvTab.slice(1).map(r => r.slice(-1)).map(r => parseFloat(r[0])))
  
    const [numExamples, ...inputShapeForModel] = encodedTrainingData.shape
    const layers = arch.map((units, index) => {
      const layer = { units }
      if (index === 0) {
        layer["inputShape"] = inputShapeForModel
      }
      return tf.layers.dense(layer)
    })
    const flattenLayer = tf.layers.flatten()
    layers.push(flattenLayer)
    const outputLayer = tf.layers.dense({ units: 1 })
    layers.push(outputLayer)

    const model = tf.sequential({ layers })
    console.log(model.summary())
  
    model.compile({
      optimizer,
      loss,
      metrics
    })

    return [encodedTrainingData, y, model]
  })

  const [encodedTrainingData, y, model] = setupModel()
  const trainedModel = await model.fit(encodedTrainingData, y, {batchSize, epochs, validationSplit, callbacks: {onEpochEnd, onTrainEnd}})
}