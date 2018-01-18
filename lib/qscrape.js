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
      $('div.qscrape').html(data.toString());
      // shorten the text in the source divs to just the file
      // and line number of the first element of the stack trace
      let sourceDivs = $('tr.test-source');
      sourceDivs.each(function(index, element){
        $element = $(element);
        let text = $('pre', $element).text();
        // get the first line of the stack trace
        let firstLine = text.split("at")[1];
        // get the path name out of the line
        firstLine = firstLine.match(/\(.*\)/)[0];

        // get rid of the parenthesis
        firstLine = firstLine.slice(1,-1);

        // cut off the locahost:8000
        firstLine = firstLine.split("8000")[1];

        let cwd = atom.project.getPaths();
        //console.log(`${cwd}${firstLine}`);

        let fullPath = `${cwd}${firstLine}`;
        let path = fullPath.split(":")[0];
        let options = {
          "initialLine" : fullPath.split(":")[1],
          "initialColumn" : fullPath.split(":")[2]
        }

        $('td', $element)
          .append($('<a>')
          .text(fullPath)
          .click(function(){
            atom.workspace.open(path, options);
          }));
      });
    });
  }

};
