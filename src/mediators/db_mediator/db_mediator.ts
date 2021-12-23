import MethodResponce from "../../models/method_responce/method_responce";
import LogService from "../../services/log_service/log_service";
import pool from "./db_auth"

class DbMediator {
    private static client: any;

    public static async initConnection(): Promise<boolean>{
        if(this.client == null || !this.client._connected) {
            this.client = await pool.connect();
        }
        return true;
    }

    public static async getCountDataInTable(NameOfTable : string, Values: Map<String, any>): Promise<MethodResponce>{
        await this.initConnection();
        let arrayValues: Array<any> = [];
        for (let [key, value] of Values) {
            if (typeof(value) === 'string'){
                arrayValues.push(`${key} = '${value}'`);
            } else {
                arrayValues.push(`${key} = ${value}`);
            }
        };
        const stringValues = arrayValues.join(' AND ');
        console.log(arrayValues);
        console.log(stringValues);
        try{          
            const queryString = `SELECT COUNT(*) FROM ${NameOfTable} WHERE ${stringValues}`;
            LogService.printLog(`Get count data from table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            const results =  result ? result.rows : null;
            return new MethodResponce(results);
        } catch(err) {
            LogService.printLog("Error during getting count data from table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    }

    public static async getAllDataFromTable(NameOfTable : string): Promise<MethodResponce>{
        await this.initConnection();
        try{          
            const queryString = `SELECT * FROM ${NameOfTable}`;
            LogService.printLog(`Get all data from table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            const results =  result ? result.rows : null;
            return new MethodResponce(results);
        } catch(err) {
            LogService.printLog("Error during getting all data from table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    };

    public static async getDataFromTable(NameOfTable: string, NameOfRow: string, Value: any): Promise<MethodResponce>{
        await this.initConnection();
        let queryString = "";
        try{
            if (typeof(Value) === 'string'){
                queryString = `SELECT * FROM ${NameOfTable} WHERE ${NameOfRow} LIKE '${Value}'`;
            } else {
                queryString = `SELECT * FROM ${NameOfTable} WHERE ${NameOfRow} = ${Value}`;
            }
            LogService.printLog(`Get data from table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            const results =  result ? result.rows : null;
            return new MethodResponce(results);
        } catch(err) {
            LogService.printLog("Error during getting data from table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    }

    public static async getDataFromTwoTable(NameOfTable1: string, NameOfTable2: string, NameOfRow1Order: string, NameOfRow2Goal: string, NameOfRow2Order: string, Value: any): Promise<MethodResponce>{
        await this.initConnection();
        let queryString = "";
        try{
            if (typeof(Value) === 'string'){
                queryString = `SELECT * FROM ${NameOfTable1} WHERE ${NameOfRow1Order} in (SELECT ${NameOfRow2Goal} FROM ${NameOfTable2} WHERE ${NameOfRow2Order} LIKE '${Value}')`;
            } else {
                queryString = `SELECT * FROM ${NameOfTable1} WHERE ${NameOfRow1Order} in (SELECT ${NameOfRow2Goal} FROM ${NameOfTable2} WHERE ${NameOfRow2Order} = ${Value})`;
            }
            LogService.printLog(`Get data from table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            const results =  result ? result.rows : null;
            return new MethodResponce(results);
        } catch(err) {
            LogService.printLog("Error during getting data from table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    }

    public static async addDataToTable(NameOfTable: string, Values: Map<String, any>): Promise<MethodResponce>{
        await this.initConnection();
        let arrayKeys: Array<String> = [];
        let arrayValues: Array<any> = [];
        for (let [key, value] of Values) {
            arrayKeys.push(`${key}`);
            if (typeof(value) === 'string'){
                arrayValues.push(`'${value}'`);
            } else {
                arrayValues.push(`${value}`);
            }
        };
        console.log(arrayValues);
        console.log(arrayKeys);
        let stringValues = arrayValues.join();
        let stringKeys = arrayKeys.join();
        LogService.printLog(stringValues);
        LogService.printLog(stringKeys);
        try{
            const queryString = `INSERT INTO ${NameOfTable}(${stringKeys}) VALUES (${stringValues})`;
            LogService.printLog(`Add data into the table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            console.log(result);
            if (result.rowCount>0){
                return new MethodResponce(true);
            } else {
                return new MethodResponce(false, [result.command, result.rowCount]);
            }
        } catch(err) {
            LogService.printLog("Error during adding data to table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    }

    public static async deleteDataByIdInTable(NameOfTable: string, NameOfRow: string, IDs: Array<any>): Promise<MethodResponce>{
        await this.initConnection();
        let arrayID: Array<any> = [];
        if (typeof(IDs[0]) === 'string'){
            for (let value of IDs) {
                arrayID.push(`'${value}'`);
            };
        } else {
            for (let value of IDs) {
                arrayID.push(`${value}`);
            };
        }
        
        console.log(arrayID);
        let stringValues = arrayID.join();
        LogService.printLog(stringValues);
        try{
            const queryString = `DELETE FROM ${NameOfTable} WHERE ${NameOfRow} In (${stringValues})`; 
            LogService.printLog(`Delete data from table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            console.log(result);
            if (result.rowCount>0){
                return new MethodResponce(true);
            } else {
                return new MethodResponce(false, [result.command, result.rowCount]);
            }
        } catch(err) {
            LogService.printLog("Error during deleting data from table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    }

    public static async deleteDataByParametersInTable(NameOfTable : string, Values: Map<String, any>): Promise<MethodResponce>{
        await this.initConnection();
        let arrayValues: Array<any> = [];
        for (let [key, value] of Values) {
            if (typeof(value) === 'string'){
                arrayValues.push(`${key} = '${value}'`);
            } else {
                arrayValues.push(`${key} = ${value}`);
            }
        };
        const stringValues = arrayValues.join(' AND ');
        console.log(arrayValues);
        console.log(stringValues);
        try{          
            const queryString = `DELETE FROM ${NameOfTable} WHERE ${stringValues}`;
            LogService.printLog(`Get delete data from table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            const results =  result ? result.rows : null;
            return new MethodResponce(results);
        } catch(err) {
            LogService.printLog("Error during getting delete data from table. " + err);
            return new MethodResponce("", [err.message]);
        }  
    }

    public static async updateDataInTable(NameOfTable: String, Values: Map<String, any>, Condition: Map<String, any>): Promise<MethodResponce>{
        await this.initConnection();
        const checkCondition = Array.from(Condition)[0]
        let arrayValues: Array<any> = [];
        let arrayCondition: Array<any> = [];
        for (let [key, value] of Values) {
            if (typeof(value) === 'string'){
                arrayValues.push(`${key} = '${value}'`);
            } else {
                arrayValues.push(`${key} = ${value}`);
            }
        };
        if (typeof(checkCondition) === 'string'){
            for (let [key, value] of Condition) {
                arrayCondition.push(`${key} = '${value}'`);
            };
        } else {
            for (let [key, value] of Condition) {
                arrayCondition.push(`${key} = ${value}`);
            };
        }
        
        const stringValues = arrayValues.join();
        const stringCondition = arrayCondition.join();
        console.log(arrayValues);
        console.log(stringValues);
        console.log(stringCondition);
        try{
            const queryString = `UPDATE ${NameOfTable} SET ${stringValues} WHERE ${stringCondition}`;
            LogService.printLog(`Update data in the table DB request: ${queryString}`);

            const result = await this.client.query(queryString);
            console.log(result);
            if (result.rowCount>0){
                return new MethodResponce(true);
            } else {
                return new MethodResponce(false, [result.command, result.rowCount]);
            }
        } catch(err) {
            LogService.printLog("Error during updating data in table. " + err);
            return new MethodResponce("", [err.message]);
        }    
    }
    
}

export default DbMediator;