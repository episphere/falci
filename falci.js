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
    div.appendChild(tb0)
    tb0.innerHTML=`<tr><td>TM2</td><td>(...)</td><td>TM9</td></tr>
                   <tr><td id="TM2td"></td><td id="poretd"></td><td id="TM9td"></td></tr>`
    let TM2tb = document.createElement('table')
    let TM9tb = document.createElement('table')
    TM9td.appendChild(TM9tb)
    // build TM table
    let TMhtml=(i0,n)=>{
        let h = ''
        for(var i=i0;i<=n;i++){
            h+=`<tr><td id="TMi_${i}">${i}</td></tr>`
        }
        return h
    }
    TM2td.innerHTML=TMhtml(1,TM2n)
    TM9td.innerHTML=TMhtml(TM2n+1,TM2n+TM9n)
}


