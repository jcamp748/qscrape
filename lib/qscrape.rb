require "selenium-webdriver"
require 'json'

ID_TESTRESULT = 'qunit-testresult'

def qscrape
  dir = `pwd`
  $driver = Selenium::WebDriver.for :chrome
  $driver.navigate.to "http://localhost:8000"

  ::Selenium::WebDriver::Wait.new(timeout: 4).until do
    completed?
  end
  jquery = '$("ol#qunit-tests li.fail li.fail tr.test-source pre")'
  errors = $driver.execute_script("return #{jquery}");
  regex = /localhost:8000/
  errors.each do |error, index|
    puts dir.chomp << error.text.lines.first.split(regex).last.chop.chop
  end

  jquery = '$("li.fail tbody")'
  data_objects = $driver.execute_script("return #{jquery}");
  #file = File.open("debug.info", "w");
  metronome_data = Hash.new
  data_objects.each_with_index do |data, index|
    #file.puts data.text
    metronome_data[index] = data.text
  end
  #return JSON.pretty_generate(metronome_data)

end

def completed?
  $driver[ID_TESTRESULT]
end

qscrape
