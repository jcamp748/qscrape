'use babel';

import QscrapeView from './qscrape-view';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qscrape:toggle': () => this.toggle()
    }));

    this.subscriptions.add(atom.workspace.addOpener(uri => {
      if (uri === 'atom://qscrape') {
        return new QscrapeView();
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.qscrapeView.destroy();
  },

  toggle() {
    atom.workspace.toggle('atom://qscrape');
  }

};
