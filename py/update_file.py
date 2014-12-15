#!/usr/bin/env python3

import cgi

form = cgi.FieldStorage()

print("Content-Type: text/plain\n");

if form["data"] and form["fname"]:
    data = form["data"].value
    file_name = form["fname"].value

    f = open("../admin/content/" + file_name, "w")
    f.write(data)

    print("OK")
else:
    print("ERROR")