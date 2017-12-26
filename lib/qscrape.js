'use babel';

import QscrapeView from './qscrape-view';
import { CompositeDisposable } from 'atom';

export default {

  qscrapeView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.qscrapeView = new QscrapeView(state.qscrapeViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.qscrapeView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qscrape:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.qscrapeView.destroy();
  },

  serialize() {
    return {
      qscrapeViewState: this.qscrapeView.serialize()
    };
  },

  toggle() {
    console.log('Qscrape was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
