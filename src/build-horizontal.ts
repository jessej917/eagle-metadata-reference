import { } from 'obsidian'

const buildHorizontal = (
    container: HTMLElement,
    imagesList: {[key: string]: any},
    settings: {[key: string]: any}
  ) => {
  // inject the gallery wrapper
  //const gallery = container.createEl('div')
  //gallery.addClass('grid-wrapper')
  //gallery.style.display = 'flex'
  //gallery.style.flexWrap = 'wrap'
  //gallery.style.marginRight = `-${settings.gutter}px`

  // inject and style images
  //imagesList.forEach((file: {[key: string]: string}) => {
    const figure = container.createEl('figure')
    figure.addClass('grid-item')
    figure.style.margin = `0px ${settings.gutter}px ${settings.gutter}px 0px`
    figure.style.width = 'auto'
    figure.style.height = `${settings.height}px`
    figure.style.borderRadius = `${settings.radius}px`
    figure.style.flex = '1 0 auto'
    figure.style.overflow = 'hidden'
    figure.style.cursor = 'pointer'
    figure.setAttribute('data-name', imagesList.get("1").name)
    figure.setAttribute('data-folder', imagesList.get("1").name)
    figure.setAttribute('data-src', imagesList.get("1").uri)

    const img = figure.createEl('img')
    img.style.objectFit = 'contain'
    img.style.width = 'auto'
    img.style.height = '100%'
    img.style.borderRadius = '0px'
    img.src = imagesList.get("1").uri
  //})

  return figure
}

export default buildHorizontal
