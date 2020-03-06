console.log('falci.js loaded')

falci={}

falci.ui=async(div=document.getElementById('falciDiv'))=>{
    if(typeof(div)=='string'){
        div=document.getElementById('falciDiv')
    }
    if(!div){
        console.warn('target div not found')
    }else{
        falci.div=div
    }

<<<<<<< Updated upstream
    // membrane pore bound by two aminoacid strands
    // TM (23 aa) and TM9 (17)
    let TM2n=23, TM9n=17, n=TM2n+TM9n
    let tb0 = document.createElement('table')
    tb0.align='center'
    tb0.id="TMtb"
    div.appendChild(tb0)
    tb0.innerHTML=`<tr><td align="center">TM2</td><td><i style="color:blue">* wild type</i></td><td align="center">TM9</td></tr>
                   <tr><td id="TM2td" style="background-color:silver"></td><td id="poretd"></td><td id="TM9td" style="background-color:silver"></td></tr>`
    let TM2tb = document.createElement('table')
    let TM9tb = document.createElement('table')
    TM2td.appendChild(TM2tb)
    TM9td.appendChild(TM9tb)
    // build TM table
    let TMhtml=(i0,n)=>{
        let h = ''
        for(var i=i0;i<=n;i++){
            if(i<=23){
                j=i+89 // first pos of TM2 is 90
            }else{
                j=i+342-23 // first pos of TM9 is 343
            }
            h+=`<tr><td id="TMi_${i}" class="aatd"><sup>${j} </sup></td></tr>`
        }
        //console.log(h)
        return h
=======
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
                   <tr><td id="TM2td" style="background-color:silver"></td><td id="poretd"><p><h3 align="center">Drug Resistance</h3></p><hr><div id="NNresistanceDiv">Predicted by nearest neighbors:<br>(coming soon) </div><hr><div id="ANNresistanceDiv">predicted by AI ...<br>(not developed yet)<hr></div></td><td id="TM9td" style="background-color:silver"></td></tr>`
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
>>>>>>> Stashed changes
    }
    TM2tb.innerHTML=TMhtml(1,TM2n)
    TM9tb.innerHTML=TMhtml(TM2n+1,TM2n+TM9n)
    // populate aminoacid input

<<<<<<< Updated upstream
    falci.aa=["A","R","N","D","C","Q","E","G","H","I","L","K","M","F","P","S","T","W","Y","V"]
    let aaAbr=["Ala","Arg","Asn","Asp","Cys","Gln","Glu","Gly","His","Ile","Leu","Lys","Met","Phe","Pro","Ser","Thr","Trp","Tyr","Val"]
    let aaName=["Alanine","Arginine","Asparagine","Aspartic acid","Cysteine","Glutamine","Glutamic acid","Glycine","Histidine","Isoleucine","Leucine","Lysine","Methionine","Phenylalanine","Proline","Serine","Threonine","Tryptophan","Tyrosine","Valine"]
    let wildType=["S", "F", "V", "T", "S", "E", "T", "H", "N", "F", "I", "C", "M", "I", "M", "F", "F", "I", "V", "Y", "S", "L", "F", "M", "T", "Y", "T", "I", "V", "S", "C", "I", "Q", "G", "P", "A", "L", "A", "I", "A"]
    document.body.querySelectorAll('.aatd').forEach((td,j)=>{
        let sel = document.createElement('select')
        falci.aa.forEach((a,i)=>{
            let op = document.createElement('option')
            sel.appendChild(op)
            op.value=a
            op.text=`${a} (${aaAbr[i]})`
            if(op.value==wildType[j]){op.text+='*'}
        })
        sel.value=wildType[j]
        td.appendChild(sel)
    })
    // look for run parameters
    falci.runParms()
}

falci.runParms=async()=>{
    if(location.hash.length>5){
        let parms={}
        location.hash.slice(1).split('&').forEach(r=>{
            let rr=r.split('=')
            parms[rr[0]]=rr[1]
            falci.parms=parms
        })
        if(falci.parms.refdata){
            let txt = await(await fetch(falci.parms.refdata)).text()
            falci.csvTab=txt.split(/\n+/g).map(r=>{
                return r.split(',')
            })
            falci.pre=document.createElement('pre')
            falci.pre.innerHTML=txt
            falci.div.appendChild(document.createElement('hr'))
            falci.TFdiv=document.createElement('div')
            falci.div.appendChild(falci.TFdiv)
            falci.div.appendChild(document.createElement('hr'))
            falci.div.appendChild(falci.pre) // plain display of the raw reference data
            // time for Tensor flow
            falci.tf()
        }
=======
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
    sel.onchange=falci.selChange
    td.appendChild(sel)
  })
  // look for run parameters
  falci.runParms()
}

falci.selChange=function(){
  let op=this.children[this.selectedIndex]
  if(op.text.match(/\*/g)){
    this.style.backgroundColor="white"
  }else{
    this.style.backgroundColor="yellow"
  }
}

falci.runParms = async () => {
  if(location.hash==0){
    location.hash='refdata=pedro.csv' // default demo
  }
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
      falci.nr()
      // falci.tf()
>>>>>>> Stashed changes
    }
}

/*
const encodeRow = (row) => {
    tf.oneHot(tf.tensor1d(falci.csvTab.slice(1).map(r=>r.slice(1,-1))[0].map(val => mapping[val]), 'int32'), 20
}
*/

falci.tf=async (div=falci.TFdiv)=>{
    // wrangle the data
//     let x = tf.tensor2d(falci.csvTab.slice(1).map(r=>r.slice(1,-1)))
    //let oneHotEncodedData = falci.csvTab.slice(1).map(r=>r.slice(1,-1)).map(row => tf.oneHot(tf.tensor1d(falci.csvTab.slice(1).map(r=>r.slice(1,-1))[0].map(val => mapping[val]), 'int32'), 20).print()
    //row.map(val => mapping[val]))), 20
    let xx=falci.csvTab.slice(1).map(x=>x.slice(1,-1))
    let coldx=xx.map(x1=>x1.map(x2=>falci.aa.indexOf(x2)))
    //hotx=coldx.map(x1=>x1.map(x2=>tf.oneHot(x2,20)))
    //let hotx=coldx.map(x1=>tf.oneHot(x1,20))
    hotx=await tf.oneHot(coldx.join().split(',').map(x=>parseInt(x)),20).array()
//     hotx=tf.tensor3d(tf.oneHot(coldx,falci.aa.length), [760, 40, 20])
//hotx =tf.oneHot(coldx, falci.aa.length)
    
    let x = tf.tensor3d(hotx)
    let y = tf.tensor1d(falci.csvTab.slice(1).map(r=>r.slice(-1)).map(r=>parseFloat(r[0])))
//     const model = tf.sequential()
    let layer1 = tf.layers.dense({inputShape: x.shape, units: x.shape[0]})
    let layer2 = tf.layers.dense({units: 10})
    let layer3 = tf.layers.dense({units:6})
    let output = tf.layers.dense({units: 1, activation: 'tanh'})
    const layers = [layer1, layer2, layer3, output]
    const model = tf.sequential({layers})
    console.log(model.summary())
    model.compile({optimizer: 'sgd', loss: 'meanSquaredError'})
    const trainedModel = await model.fit(x, y, {batchSize: 10, epochs: 20})
    console.log("Loss after Epoch " + i + " : " + trainedModel.history);
    
}


