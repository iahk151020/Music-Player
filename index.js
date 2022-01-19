const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playingSongName = $('h2');
const playingSongthumbnail = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const togglePlay = $('.btn-toggle-play');
const cd = $('.cd');
const toggleRepeat =  $('.btn-repeat');
const progress = $('#progress');
const cdThumb = $('.cd-thumb');
const nextButton = $('.btn-next');
const preButton = $('.btn-prev');
const randomButton = $('.btn-random');
const PLAYER_STORAGE_KEY = 'iahk-player';

const songs = [
    {
        id: 1,
        name: 'Am tham ben em',
        singer: 'Son Tung M-TP',
        path : "./assets/music/song1.mp3",
        image: "./assets/img/song1.jpg",
    },
    {
        id: 2,
        name: 'Kimetu no yaiba opening 2',
        singer: 'Aimer',
        path : "./assets/music/song2.mp3",
        image: "./assets/img/song2.jpg",
    },
    {
        id: 3,
        name: 'Kimetu no yaiba ending 2',
        singer: 'Aimer',
        path : "./assets/music/song3.mp3",
        image: "./assets/img/song3.png",
    },
    {
        id: 3,
        name: 'Kimetu no yaiba ending 2',
        singer: 'Aimer',
        path : "./assets/music/song3.mp3",
        image: "./assets/img/song3.png",
    }, 
    {
        id: 3,
        name: 'Kimetu no yaiba ending 2',
        singer: 'Aimer',
        path : "./assets/music/song3.mp3",
        image: "./assets/img/song3.png",
    },
    {
        id: 3,
        name: 'Kimetu no yaiba ending 2',
        singer: 'Aimer',
        path : "./assets/music/song3.mp3",
        image: "./assets/img/song3.png",
    }
];

const app = {
    
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs,
    currentSongIndex : 0,
    lastSongIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeated: false,
    
    defineProgerties(){
        Object.defineProperty(this, 'currentSong',{
            get(){
                return this.songs[this.currentSongIndex];
            }
        })
    },

    setConfig(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    loadConfig(){
        this.isRandom = this.config.isRandom;
        this.isRepeated = this.config.isRepeated;
    },

    render(){

        toggleRepeat.classList.toggle('active', this.isRepeated);
        randomButton.classList.toggle('active', this.isRandom);

        let _this = this;
        let htmls = this.songs.map((song, id) => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });

        $('.playlist').innerHTML = htmls.join('');

        $$('.song').forEach((song, id) => {
            song.addEventListener('click', function() {             
                _this.lastSongIndex = _this.currentSongIndex;
                _this.currentSongIndex = id;
                _this.loadCurrentSong();
                audio.play();
            })
        });
    },

    eventHandler(){

        let _this = this;
        let cdWidth = cd.offsetWidth;
        
        let cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 4000,
            iterations: Infinity
        });

        cdThumbAnimate.pause();

        document.onscroll = () => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newWidth = cdWidth - scrollTop > 0 ? cdWidth - scrollTop : 0;
            
            cd.style.width = newWidth + 'px';
            cd.style.opacity = newWidth / cdWidth;
        }


       
        togglePlay.onclick = function(){
            if (_this.isPlaying){
                audio.pause();
            } else {
                audio.play(); 
            }
        }
        
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();  
        }
        
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        audio.onended = function(){
            if (_this.isRepeated){
                audio.play();
            } else {
                nextButton.click();
            }
        }

        toggleRepeat.onclick = function(){
            _this.isRepeated = !_this.isRepeated;
            _this.setConfig('isRepeated', _this.isRepeated);
            this.classList.toggle('active', _this.isRepeated);
        }

        randomButton.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            this.classList.toggle('active', _this.isRandom);
        }

        audio.ontimeupdate = function(){
            if (audio.duration) {
                let progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e) {
            let seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        nextButton.onclick = function(){
            if(_this.isRandom){
                _this.nextRandomSong();                
            } else {
                _this.nextSong();
            }
            audio.play();
        }

        preButton.onclick = function(){
            if(_this.isRandom){
                _this.preRandomSong();                
            } else {
                _this.preSong();
            }
            audio.play();
        }

    },

    nextSong(){
        this.lastSongIndex = this.currentSongIndex;
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadCurrentSong();
    },

    preSong(){
        this.lastSongIndex = this.currentSongIndex;
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.loadCurrentSong();
    },

    nextRandomSong(){
        let newIndex;

        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentSongIndex);

        this.lastSongIndex = this.currentSongIndex;
        this.currentSongIndex = newIndex;

        this.loadCurrentSong();

    },

    preRandomSong(){
        let newIndex = this.lastSongIndex;

        this.lastSongIndex = this.currentSongIndex;
        this.currentSongIndex = newIndex;

        this.loadCurrentSong();
    },

    loadCurrentSong(){
    
        playingSongName.textContent = this.currentSong.name;
        playingSongthumbnail.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;

        let currentSongE = $$('.song')[this.currentSongIndex];
        currentSongE.classList.add('active');

        let lastSongE = $$('.song')[this.lastSongIndex];
        lastSongE.classList.remove('active');

    },

    start(){
        this.loadConfig();
        this.defineProgerties();
        this.render();
        this.loadCurrentSong();
        this.eventHandler();
    }
}

app.start();
