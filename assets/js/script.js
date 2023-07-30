import { data } from "./data.js";
import { renderItemTrack, renderCurrentItem, toMinAndSec, shuffle } from "./utils.js";

const AudioControler = {
  state: {
    audios: [],
    current: {},
    repeating: false,
    playing: false,
    volume: 0.5,
  },
  initVariables() {
    this.playBtn = null
    this.audioList = document.querySelector('.items')
    this.currentItem = document.querySelector('.current')
    this.repeatBtn = document.querySelector('.handling-repeat')
    this.volumeBtn = document.querySelector('.controls-volume')
    this.sound = document.querySelector('.icon-sound')
    this.shuffleBtn = document.querySelector('.handling-shuffle')

    this.sound.innerHTML = `<use xlink:href="./assets/images/sprite.svg#sound"></use>`
  },
  initEvents() {
    this.audioList.addEventListener('click', this.handleItem.bind(this))
    this.repeatBtn.addEventListener('click', this.handleRepeat.bind(this))
    this.volumeBtn.addEventListener('click', this.handleVolume.bind(this))
    this.shuffleBtn.addEventListener('click', this.handleShuffle.bind(this))
  },
  handleItem({ target }) {
    const { id } = target.dataset

    if (!id) return
    this.setCurrentItem(id)
  },
  handleRepeat({currentTarget}) {
    const { repeating } = this.state
    currentTarget.classList.toggle('active', !repeating)

    this.state.repeating = !repeating
  },
  handleVolume({ target: { value } }) {
    const {current} = this.state
    this.state.volume = value

    if (!current?.audio) return
    current.audio.volume = value

    if (!current.audio.volume) {
      this.sound.innerHTML = `<use xlink:href="./assets/images/sprite.svg#soundOff"></use>`
    } else {
      this.sound.innerHTML = `<use xlink:href="./assets/images/sprite.svg#sound"></use>`
    }
  },
  handleShuffle() {
    const { children } = this.audioList
    const shuffled = shuffle([...children])

    this.audioList.innerHTML = ''
    shuffled.forEach(item => this.audioList.appendChild(item))
  },
  togglePlaying() {
    const { current, playing } = this.state
    const { audio } = current

    playing ? audio.play() : audio.pause()

    this.playBtn.classList.toggle('playing', playing)
  },
  setCurrentItem(itemId) {
    const current = this.state.audios.find(elem => +elem.id === +itemId)

    if (!current) return

    this.pauseCurrentAudio()

    this.state.current = current
    this.currentItem.innerHTML = renderCurrentItem(current)

    current.audio.volume = this.state.volume

    this.handlePlayer()
    this.audioUpdateHandler(current)

    setTimeout(() => {
      this.togglePlaying()
    }, 0)
  },
  handlePlayer() {
    const play = document.querySelector('.controls-play')
    const prev = document.querySelector('.controls-prev')
    const next = document.querySelector('.controls-next')
    this.playBtn = play

    play.addEventListener('click', this.handleAudioPlay.bind(this))
    prev.addEventListener('click', this.handlePrevAudio.bind(this))
    next.addEventListener('click', this.handleNextAudio.bind(this))
  },
  audioUpdateHandler({audio, duration}) {
    const progess = document.querySelector('.progress')
    const progessCurrent = document.querySelector('.progress-current')
    const timeline = document.querySelector('.timeline-start')

    audio.addEventListener('timeupdate', ({ target }) => {
      const { currentTime } = target
      const width = (currentTime * 100) / duration
      timeline.innerHTML = toMinAndSec(currentTime)
      progessCurrent.style.width = `${width}%`
    })

    audio.addEventListener('ended', ({ target }) => {
      target.currentTime = 0
      progessCurrent.style.width = '0%'
      this.state.repeating ? target.play() : this.handleNextAudio()
    })

    progess.addEventListener('click', setProgress)

    function setProgress(e) {
      const width = this.clientWidth
      const clickX = e.offsetX
      audio.currentTime = (clickX / width) * duration
      timeline.innerHTML = toMinAndSec(audio.currentTime)
    }
  },
  handleAudioPlay() {
    const { current, playing } = this.state
    const { audio } = current

    !playing ? audio.play() : audio.pause()
    this.state.playing = !playing

    this.playBtn.classList.toggle('playing', !playing)
  },
  handlePrevAudio() {
    const { current } = this.state
    const currentItem = document.querySelector(`[data-id="${current.id}"]`)

    const prev = currentItem.previousSibling.previousSibling?.dataset
    const last = this.audioList.children[3]?.dataset

    const itemId = prev?.id || last?.id

    if (!itemId) return

    this.setCurrentItem(itemId)
  },
  handleNextAudio() {
    const { current } = this.state
    const currentItem = document.querySelector(`[data-id="${current.id}"]`)
    const next = currentItem.nextSibling.nextSibling?.dataset
    const first = this.audioList.children[0]?.dataset
    const itemId = next?.id || first?.id

    if (!itemId) return len

    this.setCurrentItem(itemId)
  },
  pauseCurrentAudio() {
    const { current: {audio} } = this.state
    
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  },
  renderAudios() {
    data.forEach(item => {
      const audio = new Audio(`./assets/audio/${item.link}`)

      audio.addEventListener('loadeddata', () => {
        const newItem = { ...item, duration: audio.duration, audio }
        this.state.audios = [...this.state.audios, newItem]
        renderItemTrack(newItem, this.audioList)
      })
    })
  },
  init() {
    this.initVariables()
    this.renderAudios()
    this.initEvents()
  }
}

AudioControler.init()