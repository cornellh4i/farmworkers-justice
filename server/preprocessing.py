import sys
import pandas as pd
from pymongo import MongoClient
import os

latestFY = 2020
earliestFY = (latestFY + 1) - 10

def preprocessing():
    """
    Returns the preprocessed dataframe

    This method
        (1) Concatenates into a single csv file
        (2) Drops the unnecessary columns
        (3) Retains rows of data from earliestFY to latestFY
        (4) Converts the columns to numeric type
        (5) Sends the data to a MongoDB collection labeled "naws-preprocessed"
    """

    readNewData()

    df = pd.read_csv("./src/db/combined.csv")

    # Need to answer why FY and FWID is not a necessary variable
    necessaryVariables = sys.argv[1].split(",")
    necessaryVariables.append("FY")

    # Processes dropping the variables that are not in necessaryVariables
    necessaryVariablesFinal = ["value"]*len(necessaryVariables)

    for i in range(len(necessaryVariables)):
        necessaryVariablesFinal[i] = necessaryVariables[i].lower()

    dropped_df = pd.DataFrame()
    for (columnName, columnData) in df.iteritems():
        if columnName.lower() in necessaryVariablesFinal:
            dropped_df[columnName] = columnData.values

    # Reassign df to the proper dataframe
    df = dropped_df
    
    df = df[(df['FY'] >= earliestFY) & (df['FY'] <= latestFY)]

    for (columnName, columnData) in df.iteritems():
       if columnData.dtype != "object":
            df[columnName] = pd.to_numeric(columnData.values)

    sendToMongo(df)
    
    df.to_csv("./src/db/preprocessed.csv")

    return df

def readNewData():
    """
    Reads new data and concatenates into a single csv file
    """
    df1 = pd.read_csv("./src/db/data/NAWS_A2E191.csv")
    df2 = pd.read_csv("./src/db/data/NAWS_F2Y191.csv")
    df3 = df1.merge(df2)
    df3.to_csv("./src/db/combined.csv")

def sendToMongo(df):
    """
    Inserts a dataframe to the appropriate MongoDB collection

    Parameter df: dataframe to send to MongoDB
    Precondition: df is an object of type Pandas.DataFrame
    """
    myclient = MongoClient(sys.argv[2])
    db = myclient["naws"]
    collection = db["naws-preprocessed"]
    df.reset_index(inplace = True)
    data_dict = df.to_dict("records")
    collection.delete_many({ })
    collection.insert_many(data_dict)


if (os.path.exists("./src/db/data/NAWS_A2E191.csv") and os.path.exists("./src/db/data/NAWS_F2Y191.csv")):
    preprocessing()