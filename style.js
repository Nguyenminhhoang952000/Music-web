
"use strict";
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const audio = $('#audio')
const player = $('.player')
const togglePlay= $('.control .btn-toggle-play')
const progress = $('#progress')
const cdWidth = $('.cd').offsetWidth
const btnPrev = $('.btn-prev')
const btnNext= $('.btn-next')
const btnRepeat = $('.btn-repeat')
const btnRandom = $('.btn-random')
const volumerRan= $('.volumerRange')

const listsongs = {
    curentIndex:0,
    isPlay: false,
    isRepeat: false,
    isRandom: false,
    songs:[
        {
            name:'Havana',
            singer:'Hoang',
            path:'./assets/music/song1.mp3',
            image:'./assets/img/song1.jpg',
        },
        {
            name:'See you again',
            singer:'BTS',
            path:'./assets/music/song2.mp3',
            image:'./assets/img/song2.jpg',
        },
        {
            name:'Sent',
            singer:'Dj Suremix',
            path:'./assets/music/song3.mp3',
            image:'./assets/img/song3.jpg',
        },
        {
            name:'What you do',
            singer:'Juteen',
            path:'./assets/music/song4.mp3',
            image:'./assets/img/song4.jpg',
        },
        {
            name:'Why not me',
            singer:'Garean',
            path:'./assets/music/song5.mp3',
            image:'./assets/img/song5.jpg',
        },
        {
            name:'Baby',
            singer:'Closeseen',
            path:'./assets/music/song6.mp3',
            image:'./assets/img/song6.jpg',
        },
        {
            name:'Co le nao',
            singer:'Jeateen',
            path:'./assets/music/song7.mp3',
            image:'./assets/img/song7.jpg',
        },
        {
            name:'Hey girl',
            singer:'Sixnight',
            path:'./assets/music/song8.mp3',
            image:'./assets/img/song8.jpg',
        },
        {
            name:'Rocktion',
            singer:'RPT_Hoang',
            path:'./assets/music/song9.mp3',
            image:'./assets/img/song9.jpg',
        },
    ],
    getSong(){
      let playsong=this.songs.map(function(song,id){
        return `<div class="song">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
      }) 
      $('.playlist').innerHTML = playsong.join('')       
    },
    loadCurrent(){
        $('.player h2').innerHTML = this.songs[this.curentIndex].name
        $('.player .cd-thumb').style.backgroundImage=`url(${this.songs[this.curentIndex].image})`
        audio.src = `${this.songs[this.curentIndex].path}`    
    },
    currenActive(){
        if($('.song.active')){
            $('.song.active').classList.remove('active')          
        }
        $$('.song')[this.curentIndex].classList.add('active')
    },
    handerEventsong(){
        let _this=this;
        
        //Click box Song
        [...$$('.song')].forEach(function(song,id){
            song.onclick = function(element){
                let songActive = element.target.closest('.song:not(.active)')
                if(songActive){
                if(element.target.closest('.playlist .option')){
                    console.log(element.target)
                }
                else{
                    if(songActive){
                        if($('.song.active')){
                            $('.song.active').classList.remove('active')          
                        }
                        song.classList.add('active')
                        _this.curentIndex=id
                        localStorage.setItem('Index',JSON.stringify(id))
                        _this.loadCurrent()
                        audio.play()
                    
                    }
                }
                }
            }
        })
        //Xử lý khi cuộn xuống
        document.onscroll=function(){
            const heightScroll = window.scrollY || document.documentElement.scrollTop
            const scrollWidth = cdWidth - heightScroll
             $('.cd').style.width = scrollWidth>0?scrollWidth +'px':0
             $('.cd').style.opacity = scrollWidth / cdWidth
        }
        //Click btn-prev
        btnPrev.onclick = function() {
            _this.clickPrev()   
        }  
        //Click btn-next
        btnNext.onclick= function() {
            _this.clickNext()           
        }     
        //Click repeat
        btnRepeat.onclick = function() { 
            if(btnRepeat.classList.contains('active')){
                btnRepeat.classList.remove('active')
                _this.isRepeat=false
                localStorage.setItem('isRepeat',JSON.stringify(_this.isRepeat))
            }
            else{
                btnRepeat.classList.add('active')
                _this.isRepeat=true
                localStorage.setItem('isRepeat',JSON.stringify(_this.isRepeat))
            }
            if(JSON.parse(localStorage.getItem('isRepeat'))){
                console.log(localStorage.getItem('isRepeat'))
                audio.onended = function(){
                    progress.value=0
                    audio.currentTime=0
                    audio.play()
                }
            }
            else{
                audio.onended=function(){
                    _this.clickNext()
                }
            }
        }
        //Click Random 
        btnRandom.onclick = function(){
            if(btnRandom.classList.contains('active')){
                btnRandom.classList.remove('active')
                _this.isRandom=false
                localStorage.setItem('isRandom',JSON.stringify(_this.isRandom))
            }
            else{
                btnRandom.classList.add('active')
                _this.isRandom=true
                localStorage.setItem('isRandom',JSON.stringify(_this.isRandom))
            }
            if(JSON.parse(localStorage.getItem('isRandoms'))){
                audio.onended=function(){
                    let RandomNumber = Math.floor(Math.random()*8)
                    _this.curentIndex = RandomNumber
                    localStorage.setItem('Index',JSON.stringify(RandomNumber))
                    _this.loadCurrent()
                    _this.currenActive()
                    _this.scrollView()
                    audio.play()
                }
            }
        }
        //Play Song
        togglePlay.onclick=function(){  
            if(!_this.isPlay){
                audio.play()       
            }
            else{
                audio.pause()             
            }  
        }
        audio.onplay=function(){
            player.classList.add("playing")
            _this.isPlay=true
            AnimationCd.play()
        }
        audio.onpause=function(){
            _this.isPlay=false
            player.classList.remove("playing")
            AnimationCd.pause()
        }
        //Xử lý volumer cho music
        audio.ontimeupdate=function(){
            if(audio.volume){
                volumerRan.value = audio.volume
            }
        }
        volumerRan.onchange=function(){
            audio.volume = volumerRan.value
        }



        //Xử lý thanh thời gian
        audio.ontimeupdate=function(){
        if(audio.duration){
            progress.value =(audio.currentTime*100)/audio.duration
        }
        }
        progress.onchange=function(){
            console.log('heelo')
            audio.currentTime = (progress.value*audio.duration)/100
        }
        const AnimationCd= $('.cd-thumb').animate([
            {transform: 'rotate(-360deg)'}],
            {
                duration:10000,
                iterations: Infinity
            }
        )
        AnimationCd.pause()
    },
    CheckBtnLocal(){
        const checkRepeat= JSON.parse(localStorage.getItem('isRepeat'))
        const checkRandom= JSON.parse(localStorage.getItem('isRandom'))
        this.curentIndex = JSON.parse(localStorage.getItem('Index'))
        if(checkRepeat){
            btnRepeat.classList.add('active')
        }
        else{
            btnRepeat.classList.remove('active')
        }
        if(checkRandom){
            btnRandom.classList.add('active')
        }
        else{
            btnRandom.classList.remove('active')
        }
        if(this.curentIndex){
            this.loadCurrent()
            this.currenActive()
        }
    },
    scrollView(){
        setTimeout(() => {
            if(this.curentIndex<=3){
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block:'end'
                })
            }
            else{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block:'nearest'
                })
            }
        },200);
        
    },
    clickNext(){
        if(this.isRandom){
            let RandomNumber = Math.floor(Math.random()*8)
            this.curentIndex = RandomNumber
            localStorage.setItem('Index',JSON.stringify(RandomNumber))
            this.loadCurrent()
            this.currenActive()
            this.scrollView()
            audio.play()
        }
        else{
            const lengthSongs = listsongs.songs.length
            if(this.curentIndex>=lengthSongs-1){
                this.curentIndex=lengthSongs-1
            }
            else{
                this.curentIndex++
                localStorage.setItem('Index',JSON.stringify(this.curentIndex))
                this.loadCurrent()
                this.currenActive()
                this.scrollView()
                audio.play()
            }
            
        }
    },
    clickPrev(){
        if(this.isRandom){
            let RandomNumber = Math.floor(Math.random()*8)
            this.curentIndex = RandomNumber
            localStorage.setItem('Index',JSON.stringify(RandomNumber))
            this.loadCurrent()
            this.currenActive()
            this.scrollView()
            audio.play()
        }
        else{
            if(this.curentIndex<1){
                this.curentIndex=0
            } 
            else{
                this.curentIndex--
                localStorage.setItem('Index',JSON.stringify(this.curentIndex))
                this.loadCurrent()
                this.currenActive()
                this.scrollView()
                audio.play()
            }
            
        }
    },
    // LoadStorage(){ 
    //     localStorage.setItem('isRepat',this.isRepeat)
    // }
    // ,
    start(){
        this.getSong()
        this.loadCurrent()
        $$('.song')[0].classList.add('active')
        this.CheckBtnLocal()
        this.handerEventsong()       
        console.log(localStorage.getItem('isRepeat'))
    }

}
listsongs.start()
