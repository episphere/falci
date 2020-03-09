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

  // membrane pore bound by two aminoacid strands
  // TM (23 aa) and TM9 (17)
  let TM2n = 23,
    TM9n = 17,
    n = TM2n + TM9n
  let tb0 = document.createElement('table')
  tb0.align = 'center'
  tb0.id = "TMtb"
  div.appendChild(tb0)
  tb0.innerHTML = `<tr><td align="center">TM2</td><td align="center"><i style="color:blue">* wild type</i></td><td align="center">TM9</td></tr>
                   <tr><td id="TM2td" style="background-color:silver"></td><td id="poretd"><p><h3 align="center">Drug Resistance</h3></p><hr><div id="NNresistanceDiv" align="center"><h4>Of nearest neighbors:</h4><h4><span id="nnPredict" style="background-color:yellow">select mutations</span></h4></div><hr><div id="ANNresistanceDiv" align="center"><h4>Predicted by AI:</h4><p>(proposed)</p><hr></div></td><td id="TM9td" style="background-color:silver"></td></tr>`
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
//>>>>>>> Stashed changes
    }
    return h
  }
  TM2tb.innerHTML=TMhtml(1,TM2n)
  TM9tb.innerHTML=TMhtml(TM2n+1,TM2n+TM9n)

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
  // calculate resistance
  nnPredict.textContent=`${Math.round(falci.jaccard()).toFixed(1)} % survival`

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
      falci.x=falci.csvTab.slice(1).map(x=>x.slice(1,-1))
      falci.y=falci.csvTab.slice(1).map(x=>parseFloat(x.slice(-1)[0]))
      falci.pre = document.createElement('pre')
      falci.pre.hidden=true
      falci.pre.innerHTML = txt
      falci.div.appendChild(document.createElement('hr'))
      falci.TFdiv = document.createElement('div')
      falci.div.appendChild(falci.TFdiv)
      //falci.div.appendChild(document.createElement('hr'))
      let btShowHideRef=document.createElement('button')
      btShowHideRef.id="btShowHideRef"
      btShowHideRef.textContent="Show Reference Data"
      btShowHideRef.style.backgroundColor='lime'
      btShowHideRef.onclick=_=>{
        if(falci.pre.hidden){
          falci.pre.hidden=false
          btShowHideRef.textContent="Hide Reference Data"
          btShowHideRef.style.backgroundColor='orange'
        }else{
          falci.pre.hidden=true
          btShowHideRef.textContent="Show Reference Data"
          btShowHideRef.style.backgroundColor='lime'
        }
      }
      let loadRefData=document.createElement('button')
      loadRefData.textContent="Load Reference Data"
      let downloadRefData=document.createElement('button')
      downloadRefData.textContent="Download Reference Data"
      let loadExperiments=document.createElement('button')
      loadExperiments.textContent="Load experimental profiles"
      falci.div.appendChild(btShowHideRef)
      falci.div.appendChild(loadRefData)
      falci.div.appendChild(downloadRefData)
      falci.div.appendChild(loadExperiments)
      loadRefData.onclick=downloadRefData.onclick=loadExperiments.onclick=function(){
        alert(`function "${this.textContent}" not activated yet`)
      }
      falci.div.appendChild(falci.pre) // plain display of the raw reference data
      // time for Tensor flow
      //falci.nr()
      // falci.tf()
//>>>>>>> Stashed changes
    }
  }
}

falci.jaccard=q=>{
  if(!q){ // get it from selector
    q = [...document.querySelectorAll('select')].map(x=>x.value)
  }
  let dist=[] // distance
  falci.x.map((xi,i)=>{
    dist[i] = xi.map((xij,j)=>xij==q[j]).reduce((a,b)=>a+b)
    //debugger
  })
  let closeK=[]
  maxDist=dist.reduce((a,b)=>Math.max(a,b))
  dist.forEach((d,i)=>{
    if(d==maxDist){
      closeK.push(falci.y[i])
    }
  })
  return closeK.reduce((a,b)=>a+b)/closeK.length
}
