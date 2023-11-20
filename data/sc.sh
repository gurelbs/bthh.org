#!/bin/bash

# Initialize empty array 
arr=()

# Read input file line by line
while read line; do

  # Trim whitespace  
  trim=$(echo "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')

  # Add quotes around trimmed line
  formatted=\"$trim\"

  # Add line to array
  arr+=("$formatted"',')

done < data.txt  

# Build full JavaScript array syntax
jsarray="const data = [${arr[@]}];" 

# Print to output file
echo "$jsarray" > output.js