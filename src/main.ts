import { App, Plugin, Setting, PluginSettingTab, Notice } from 'obsidian'
import { imgGalleryInit } from './imgGalleryInit';


interface ImgGallerySettings {
  RootDir: string;
}

const DEFAULT_SETTINGS: ImgGallerySettings = {
  RootDir: 'default'
}

export default class ImgGallery extends Plugin {
  settings: ImgGallerySettings;
  async onload() {
    await this.loadSettings();
    this.registerMarkdownCodeBlockProcessor('reference', (src, el, ctx) => {
      const handler = new imgGalleryInit(this, src, el, this.app)
      ctx.addChild(handler)
    })

    //Load Settings Tab
    this.addSettingTab(new ImgGallerySettingTab(this.app, this));
  }

  onunload() { }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}


class ImgGallerySettingTab extends PluginSettingTab {
  plugin: ImgGallery;

  constructor(app: App, plugin: ImgGallery) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Root Directory')
      .setDesc('Base Location for all files')
      .addText(text => text
        .setPlaceholder('Enter your secret')
        .setValue(this.plugin.settings.RootDir)
        .onChange(async (value) => {
          this.plugin.settings.RootDir = value;
          await this.plugin.saveSettings();
        }));
  }
}
