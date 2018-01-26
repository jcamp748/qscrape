# Qscrape

This is an Atom plugin for scraping the output of QUnit tests served over localhost

## Dependencies

- `ruby`
- `gem selenium-webdriver`
- `gem cheerio`
- `gem json`
- ChromeDriver

## Install


install ruby interpreter e.g. `sudo-apt get install ruby`

download and install Google [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/).

install selenium-webdriver gem `gem install selenium-webdriver` .

install cheerio gem `gem install cheerio` .


## Usage

- Normal user

  ` alt-q ` toggle view

  ` alt-r ` run scraper and display results

- vim-mode-plus user

  `, r r` toggle view

  `, r u` run scraper and display results

Click on file path links to quickly jump to files and make edits
