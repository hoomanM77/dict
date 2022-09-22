let input=document.querySelector('input')
let itemContainer=document.querySelector('.item')
let preLoader=document.querySelector('.pre_loader')
let audioTag=document.getElementById('audio')
class Api {
    #url;
    constructor() {
        this.#url='https://api.dictionaryapi.dev/api/v2/entries/en/'
        this.fetchedData=null
        this.userWord=null
        this.req=null
    }
    get data(){
        return this.fetchedData
    }
    set data(fetchedData){
        this.fetchedData=fetchedData
    }
    set word(word){
        this.userWord=word
    }
    async getData(){
        this.req=await fetch(this.#url + this.userWord)
        if(this.req.ok){
            return await this.req.json()
        }else{
            throw Error(this.req.status)
        }
    }
    showData(response){
        this.data=response
        preLoader.style.display='none'
        itemContainer.innerHTML=''
        let allDefinition='';
        let allSynonym='';
        let allAntonyms='';
        let allExamples='';
        let phonetic='';
        response[0].meanings.forEach(item=>{
            item.definitions.forEach((definition,index)=>{
                allDefinition+=definition.definition + ' / '
                allExamples+=definition?.example ?? ''
            })
            response[0].phonetics.forEach(item=>{
                if('text' in item){
                    phonetic=item.text
                }
            })
            allSynonym=item.synonyms.join(' / ')
            allAntonyms=item.antonyms.join(' / ')
            itemContainer.insertAdjacentHTML('beforeend',`<div class="definition_container"><div><div class="d-flex column"><h1>${response[0].word}</h1><span class="mute"><span class="phonetic">${item.partOfSpeech}</span><span>${phonetic}</span></span></div><div class="d-flex" style="gap:0.5rem"><span>UK</span><i class="fa-solid fa-volume-high uk"></i>|<span>US</span><i class="fa-solid fa-volume-high us"></i>|<span>AU</span><i class="fa-solid fa-volume-high au"></i></div></div><div class="definition" ><p> <span class="purple">Example:</span>${allExamples}</p><p> <span class="purple">Synonyms:</span>${allSynonym}</p><p> <span class="purple">Antonyms:</span>${allAntonyms}</p><p> <span class="purple">Definition:</span> ${allDefinition}</p></div></div>`)
            allExamples=''
            allSynonym=''
            allDefinition=''
        })

    }
    showError(reason){

    }
    getAudioLink(which){
        let ukLink=''
        let usLink=''
        let auLink=''
        this.data.forEach(item=>{
            item.phonetics.forEach(audio=>{
                if(audio.audio.length > 3){
                    console.log(audio.audio.slice(audio.audio.length-6,audio.audio.length-4))
                    if(audio.audio.slice(audio.audio.length-6,audio.audio.length-4) ==='uk'){
                        ukLink=audio.audio
                    }else if(audio.audio.slice(audio.audio.length-6,audio.audio.length-4)==='us'){
                        usLink=audio.audio
                    }else if(audio.audio.slice(audio.audio.length-6,audio.audio.length-4)==='au'){
                        auLink=audio.audio
                    }
                }
            })
        })
        if(which==='uk'){
            return ukLink
        }else if(which==='us'){
            return  usLink
        }else if(which==='au'){
            return auLink
        }
    }

}
let api=new Api()



document.querySelector('button').addEventListener('click',e=>{
    if(isNaN(input.value)){
        api.word=input.value
        preLoader.style.display='flex'
        api.getData().then(response=>api.showData(response)).catch(reason => api.showError(reason))
        input.value=''
    }
})

input.addEventListener('keyup',e=>{
    if(isNaN(e.target.value) && e.key==='Enter'){
        api.word=e.target.value
        preLoader.style.display='flex'
        api.getData().then(response=>api.showData(response)).catch(reason => api.showError(reason))
        input.value=''
    }
})

itemContainer.addEventListener('click',e=>{
    audioTag.setAttribute('src','')
    if(e.target.tagName==='I' && e.target.classList.contains('us')){
        api.getAudioLink('us').length > 0 && audioTag.setAttribute('src',api.getAudioLink('us'))
        audioTag.play()
    }else if(e.target.tagName==='I' && e.target.classList.contains('uk')){
        api.getAudioLink('uk').length > 0 && audioTag.setAttribute('src',api.getAudioLink('uk'))
        audioTag.play()
    }else if(e.target.tagName==='I' && e.target.classList.contains('au')){
        api.getAudioLink('au').length > 0 && audioTag.setAttribute('src',api.getAudioLink('au'))
        audioTag.play()
    }
})