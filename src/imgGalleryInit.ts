import { App, TFolder, MarkdownRenderChild, Notice } from 'obsidian';
import ImgGallery from './main';
import getSettings from './get-settings';
import buildHorizontal from './build-horizontal';
import buildVertical from './build-vertical';
import buildLightbox from './build-lightbox';
import { readFile } from 'fs';
import fs from 'fs';
import myLib from './myLib';


export class imgGalleryInit extends MarkdownRenderChild {
    private _gallery: HTMLElement = null;
    private _lightbox: any = null;
    private _settings: { [key: string]: any; } = {};
    private _imagesList: { [key: string]: any; } = {};

    constructor(
        public plugin: ImgGallery,
        public src: string,
        public container: HTMLElement,
        public app: App
    ) {
        super(container);
    }

    async onload() {
      // parse and normalize settings
      this._settings = getSettings(this.src, this.container);
      //this._imagesList = getImagesList(this.app, this.container, this._settings)

      //Get the address for the metadata.json
      let baseFolder = this.plugin.settings.RootDir;
      if (this.plugin.settings.RootDir.length > 0) {
        baseFolder = this.plugin.settings.RootDir + "/";
      }
      const jsonName = "metadata.json";
      //console.log(this._settings.path);


      const readJson = folder => new Promise((resolve, reject) => {
        let object;
        fs.readFile(folder, 'utf8', function (err, data) {
          // Display the file content
          //console.log(data);
          object = JSON.parse(data);
          //console.log(object.name);
          resolve(object);

        });
      });


      const jsonObject = await readJson(baseFolder + this._settings.path + "/" + jsonName);
      
      //Get the address for the image
      const baseSplit = app.vault.adapter.getResourcePath("./../../../../../../../../../../../../../../../../").split(":");
      const base = baseSplit[0] + ":" + baseSplit[1].substring(0, baseSplit[1].length - 1);

      this._imagesList = new Map();
      this._imagesList.set("1", {
        name: jsonObject.name + "." + jsonObject.ext,
        folder: baseFolder + this._settings.path,
        uri: base + baseFolder + this._settings.path + "/" + jsonObject.name + "." + jsonObject.ext
      });


      if (this._settings.height == 0) {
        this._settings.height = jsonObject.height;
      }

        // inject the pertinent kind of gallery
        if (this._settings.type === 'horizontal') {
            this._gallery = buildHorizontal(this.container, this._imagesList, this._settings);
        } else if (this._settings.type === 'vertical') {
            this._gallery = buildVertical(this.container, this._imagesList, this._settings);
        }

        // initialize a lightbox
        this._lightbox = buildLightbox(this._gallery, this._imagesList, this.app);
    }

    async onunload() {
        // todo: monitor the bug attached below (obsidian 1.1.8)
        // https://forum.obsidian.md/t/markdown-render-childes-are-not-being-unloaded-when-switching-notes-in-the-same-tab/49681
        // destroy the gallery
        if (this._gallery) {
            this._gallery.remove();
            this._gallery = null;
        }

        // destroy the lightbox
        if (this._lightbox) {
            this._lightbox.destroy();
            this._lightbox = null;
        }
    }
}
