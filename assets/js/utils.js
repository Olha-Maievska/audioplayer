export const renderCurrentItem = (curItem) => {
  const [image] = curItem.link.split('.')
  return `
    <div
    class="current-image"
    style="background-image: url(./assets/images/${image}.jpg);"
    ></div>
    <div class="current-info">
      <div class="current-info__top">
        <div class="current-info__titles">
          <h2 class="current-info__group">${curItem.group}</h2>
          <h3 class="current-info__track">${curItem.track}</h3>
        </div>
        <div class="current-info__year">${curItem.year}</div>
      </div>
      <div class="controls">
        <div class="controls-buttons">
          <button class="controls-button controls-prev">
            <svg class="icon-arrow">
              <use xlink:href="./assets/images/sprite.svg#arrow"></use>
            </svg>
          </button>
          <button class="controls-button controls-play">
            <svg class="icon-pause">
              <use xlink:href="./assets/images/sprite.svg#pause"></use>
            </svg>
            <svg class="icon-play">
              <use xlink:href="./assets/images/sprite.svg#play"></use>
            </svg>
          </button>
          <button class="controls-button controls-next">
            <svg class="icon-arrow">
              <use xlink:href="./assets/images/sprite.svg#arrow"></use>
            </svg>
          </button>
        </div>
        <div class="controls-progress">
          <div class="progress">
            <div class="progress-current" style="width: 0%;"></div>
          </div>
          <div class="timeline">
            <span class="timeline-start">00.00</span>
            <span class="timeline-end">${toMinAndSec(curItem.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  `
}

export const renderItemTrack = (audio, audioList) => {
  const [image] = audio.link.split('.')
  const item =  `
    <div class="item" data-id="${audio.id}">
      <div 
      class="item-image"
      style="background-image: url(./assets/images/${image}.jpg);"
      ></div>

      <div class="item-titles">
        <h2 class="item-group">${audio.group}</h2>
        <h3 class="item-track">${audio.track}</h3>
      </div>

      <p class="item-duration">${toMinAndSec(audio.duration)}</p>
      <p class="item-genre">${audio.genre}</p>
    </div>
  `

  audioList.innerHTML += item
}

const formatTime = time => (time < 10 ? `0${time}` : time)

export const toMinAndSec = (duration) => {
  const minutes = formatTime(Math.floor(duration / 60))
  const seconds = formatTime(Math.floor(duration - minutes * 60))

  return `${minutes}:${seconds}`
}

export const shuffle = (array) => array.sort(() => 0.5 - Math.random())