require "selenium-webdriver"
require 'json'
require 'ruby-cheerio'

ID_TESTRESULT = 'qunit-testresult'

def qscrape
  dir = `pwd`
  $driver = Selenium::WebDriver.for :chrome
  $driver.navigate.to "http://localhost:8000"

  ::Selenium::WebDriver::Wait.new(timeout: 4).until do
    completed?
  end

  jquery = '$("div#qunit").html();'
  html = $driver.execute_script("return #{jquery}")
  cheerio = RubyCheerio.new(html);
  cheerio.find('li.fail tbody').each do |test|
    puts test.html
  end

end

def completed?
  $driver[ID_TESTRESULT]
end

qscrape
