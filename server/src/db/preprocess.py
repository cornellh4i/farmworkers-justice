import csv
with open('combined.csv', 'rb') as inp, open('pre-processed.csv', 'wb') as out:
    writer = csv.writer(out)
    for row in csv.reader(inp):
        if (row[-1] == "FY"): 
            writer.writerow(row)
        elif (int(row[-1]) > 2008):
            writer.writerow(row)