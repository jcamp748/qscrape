'use babel';

import QscrapeView from './qscrape-view';
import { CompositeDisposable } from 'atom';
import { spawn } from 'child_process';
$ = require('jquery')

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qscrape:toggle': () => this.toggle(),
      'qscrape:runRubyScript': () => this.runRubyScript()
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
  },

  runRubyScript() {
    console.log("path");
    console.log(__dirname);
    const cmd = spawn('ruby', [`${__dirname}/qscrape.rb`]);

    cmd.stdout.on('data', (data) => {
      let hidden = document.createElement('div');
      console.log(data.toString());
      $('div.qscrape').html(data.toString());
      //atom.workspace.open('atom://qscrape');
      //console.log(`stdout: ${data}`);
    });
  }

};
