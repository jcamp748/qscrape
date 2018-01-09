require 'pp'

$dir = Dir.pwd
File.open("#{$dir}/dev/debug.info", "r") do |f|
  $data = f.read
end
regex = /\(([^)]+)\)/
pp $data[regex]
