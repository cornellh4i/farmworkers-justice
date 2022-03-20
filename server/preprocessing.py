import pandas as pd
import pymongo

def preprocessing():
    latestFY = 2020
    earliestFY = (latestFY + 1) - 10
    df = pd.read_csv("./src/db/combined.csv")

    # Need to find way to import from getUniqueVariables() function
    necessaryVariables = [
    'Crop',       'G03',      'NH05',     'NQ10ix',
    'FOREIGNB',   'MARRIED',  'A21B',     'Crowded1',
    'FWRDays',    'B07',      'HHPARENT', 'B21e',
    'D11',        'G04C',     'NQ10mx',   'HHKID',
    'G01',        'B11',      'A09',      'B21d',
    'D04',        'B21z',     'G04fx',    'G04N',
    'B17',        'MixedFam', 'NH02',     'AdultOtherIndg',
    'NH03',       'NP01F',    'NQ10dx',   'NQ10ex',
    'NQ10jx',     'D33A',     'GENDER',   'FLC',
    'Indigenous', 'NS04',     'G04B',     'G04K',
    'NQ10gx',     'NQ10hx',   'MIGRANT',  'B24',
    'NUMFEMPL',   'FAMPOV',   'WageT1',   'NQ10fx',
    'A21A',       'D23',      'NS09',     'D34x',
    'E02',        'G04E',     'A23A5',    'BLWAGE',
    'B08',        'A08',      'B02',      'B21c',
    'AGE',        'C09Weeks', 'B21b',     'B22b',
    'NH04',       'A21c2',    'D26',      'NS01',
    'B21a',       'B21f',     'B23b',     'NWWeeks',
    'NH10',       'NQ10lx',   'currstat', 'A23C5',
    'NQ01x',      'G04H',     'NQ03Bx',   'Streams',
    'G04D',       'Task',     'G04J',     'G04gx',
    'G04M',       'G04px',    'A23A3',    'NH06',
    'B01',        'D37',      'D50MTCOD', 'G04I',
    'G04L',       'NH01',     'NQ10bx',   'NQ10cx',
    'A07',        'E01x',     'FY',       'FWID',
    ]

    # necessaryVariables = ast.literal_eval(sys.argv[1])

    necessaryVariables2 = ["value"]*len(necessaryVariables)

    for i in range(len(necessaryVariables)):
        necessaryVariables2[i] = necessaryVariables[i].lower()

    dropped_df = pd.DataFrame()
    for (columnName, columnData) in df.iteritems():
        if columnName.lower() in necessaryVariables2:
            dropped_df[columnName] = columnData.values

    df = dropped_df
    
    df = df[(df['FY'] >= earliestFY) & (df['FY'] <= latestFY)]

    for (columnName, columnData) in df.iteritems():
       if columnData.dtype != "object":
            df[columnName] = pd.to_numeric(columnData.values)

    sendToMongo(df)
    
    df.to_csv("./src/db/preprocessed.csv")

    return df

def readNewData():
    df1 = pd.read_csv("./src/db/data/NAWS_A2E191.csv")
    df2 = pd.read_csv("./src/db/data/NAWS_F2Y191.csv")
    df3 = df1.merge(df2)
    df3.to_csv("./src/db/combined.csv")

def sendToMongo(df):
    myclient = pymongo.MongoClient("mongodb+srv://h4i:Justice4Farmworkers@clusterfj.7tofb.mongodb.net/naws?retryWrites=true&w=majority")
    db = myclient["naws"]
    collection = db["naws-preprocessed"]
    df.reset_index(inplace = True)
    data_dict = df.to_dict("records")
    collection.insert_many(data_dict)

preprocessing()