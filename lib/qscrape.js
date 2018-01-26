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

    // Register package commands
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qscrape:toggle': () => this.toggle(),
      'qscrape:runRubyScript': () => this.runRubyScript()
    }));

    // register package view
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

  // run a ruby script that uses Selenium to scrape the webpage form-group
  // for QUnit output and display the errors in a pane in the right dock
  runRubyScript() {

    // run script with external shell command
    const cmd = spawn('ruby', [`${__dirname}/qscrape.rb`]);

    // capture output from shell and set the html of QscrapeView
    cmd.stdout.on('data', (data) => {
      $('div.qscrape').html(data.toString());

      // modify the output of ruby script to be more readable
      //
      // shorten the text in the source divs to just the file
      // and line number of the first element of the stack trace.
      // This will relieve unnecessary overflow of the view

      // loop through each test block and generate a new <pre> tag
      // to display the stack trace in
      let sourceDivs = $('tr.test-source');
      sourceDivs.each(function(index, element){
        let $pretag = $('<pre>');
        // the element is the test block that contains <td>'s corresponding
        // to Expected output, result, diff, and stack trace
        let $element = $(element);

        // the 'pre' is the stack trace portion of element
        let text = $('pre', $element).text();

        // loop through each line of the stack trace and see if there is
        // a path in it and build up the text as we go. Change string lines
        // with `localhost` substrings to absolute paths inside <a> tags
        let lines = text.split("\n");
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

// utility function to generate anchor tag from QUnit output
function getAnchorTag(line) {
  // turn LINE with localhost relative filename into an anchor tag

  // change localhost to current project directory
  // remove everything but the filename and line:column numbers
  let cwd = atom.project.getPaths();
  let regex = /.*\http:\/\/localhost:[0-9]*/
  line = line.replace(regex, `${cwd}`);

  // get rid of trailing ")"
  regex = /\)/;
  line = line.replace(regex, "");

  // extract line and column numbers out
  let fullPath = `${line}`;
  let path = fullPath.split(":")[0];

  // move the cursor to the line and column of the error
  // `initialLine` and `initialColumn` are indexed at 0
  // so we need to subtract 1
  let options = {
    "initialLine" : parseInt(fullPath.split(":")[1]) - 1,
    "initialColumn" : parseInt(fullPath.split(":")[2]) - 1
  }

  // create tha <a> tag and return it
  return $('<a>')
    .text(fullPath)
    // display as block so each <a> appears on one line
    .css("display", "block")
    // register funtion to jump to file and line:column when clicked
    .click(function(){
      atom.workspace.open(path, options);
    });
}
