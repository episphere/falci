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
    let TM2n=23, TM9n=17, n=TM2n+TM9n
    let tb0 = document.createElement('table')
    tb0.align='center'
    tb0.id="TMtb"
    div.appendChild(tb0)
    tb0.innerHTML=`<tr><td>TM2</td><td>(...)</td><td>TM9</td></tr>
                   <tr><td id="TM2td"></td><td id="poretd"></td><td id="TM9td"></td></tr>`
    let TM2tb = document.createElement('table')
    let TM9tb = document.createElement('table')
    TM2td.appendChild(TM2tb)
    TM9td.appendChild(TM9tb)
    // build TM table
    let TMhtml=(i0,n)=>{
        let h = ''
        for(var i=i0;i<=n;i++){
            h+=`<tr><td id="TMi_${i}" class="aatd">${i}</td></tr>`
        }
        //console.log(h)
        return h
    }
    TM2tb.innerHTML=TMhtml(1,TM2n)
    TM9tb.innerHTML=TMhtml(TM2n+1,TM2n+TM9n)
    // populate aminoacid input

    let aa=["A","R","N","D","C","Q","E","G","H","I","L","K","M","F","P","S","T","W","Y","V"]
    let aaAbr=["Ala","Arg","Asn","Asp","Cys","Gln","Glu","Gly","His","Ile","Leu","Lys","Met","Phe","Pro","Ser","Thr","Trp","Tyr","Val"]
    let aaName=["Alanine","Arginine","Asparagine","Aspartic acid","Cysteine","Glutamine","Glutamic acid","Glycine","Histidine","Isoleucine","Leucine","Lysine","Methionine","Phenylalanine","Proline","Serine","Threonine","Tryptophan","Tyrosine","Valine"]

    document.body.querySelectorAll('.aatd').forEach(td=>{
        let sel = document.createElement('select')
        aa.forEach((a,i)=>{
            let op = document.createElement('option')
            sel.appendChild(op)
            op.value=i
            op.text=`${a} (${aaAbr[i]})`
        })
        td.appendChild(sel)
    })
}


