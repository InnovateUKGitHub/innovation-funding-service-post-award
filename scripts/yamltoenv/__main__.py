#!/usr/bin/python3
import fileinput
import base64

after_data = False;
for line in fileinput.input():
  if after_data:
    key, value = line.strip().split(": ")
    decoded = base64.b64decode(value).decode("utf-8").replace("\n", "\\n")
    print(f'{key}={decoded}')

  if line.startswith("data:"):
    after_data = True;
