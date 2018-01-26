'use babel';

import QscrapeView from './qscrape-view';
import { CompositeDisposable, TextBuffer } from 'atom';
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

    // open blank editor
    // atom.workspace.getActivePane().splitRight();
    // atom.workspace.open();

  },

  deactivate() {
    this.subscriptions.dispose();
    this.qscrapeView.destroy();
  },

  toggle() {
    atom.workspace.toggle('atom://qscrape');
  },



  runRubyScript() {

    const cmd = spawn('ruby', [`${__dirname}/qscrape.rb`]);

    cmd.stdout.on('data', (data) => {
      $('div.qscrape').html(data.toString());
      // shorten the text in the source divs to just the file
      // and line number of the first element of the stack trace
      let sourceDivs = $('tr.test-source');
      sourceDivs.each(function(index, element){
        let $pretag = $('<pre>');
        let $element = $(element);
        let text = $('pre', $element).text();
        let lines = text.split("\n");

        // loop through all lines and see if there is a path in it

        // build up the text as we go then change string in <pre> tag
        lines.forEach(function(line){
          let regex = /.*localhost.*/
          if(regex.test(line)) {
            // turn the line into a link
            let $tag = getAnchorTag(line);
            $pretag.append($tag);

          } else {
            // leave the line alone
            $pretag.append($('<p>').text(line));
          }
        });
        $element.children("td").empty();
        $element.children("td").append($pretag);
      });
    });
  }
};

function getAnchorTag(line) {
  // turn LINE with localhost relative filename into an anchor
  // tag with src pointing to absolute path of LINE

  // change localhost to current working directory
  let cwd = atom.project.getPaths();
  let regex = /.*\http:\/\/localhost:[0-9]*/
  line = line.replace(regex, `${cwd}`);
  regex = /\)/;
  line = line.replace(regex, "");


  let fullPath = `${line}`;
  let path = fullPath.split(":")[0];
  let options = {
    "initialLine" : fullPath.split(":")[1],
    "initialColumn" : fullPath.split(":")[2]
  }
  return $('<a>')
    .text(fullPath)
    .css("display", "block")
    .click(function(){
      atom.workspace.open(path, options);
    });
}
