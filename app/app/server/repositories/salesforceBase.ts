import salesforceConnection from './salesforceConnection';

export default abstract class salesforceBase<T>
{
    protected constructor(private objectName: string, private columns: string[]) {

    }

    protected async retrieve(id: string): Promise<T> {
        let conn = await salesforceConnection();
        let result = await conn.sobject(this.objectName)
            .retrieve(id);
        return result as T;
    }

    protected async all() : Promise<T[]>{
        let conn = await salesforceConnection();
        let result = await conn.sobject(this.objectName)
            .select(this.columns.join(", "))
            .execute();
        return result as T[];
    }

    protected async whereString(filter:string) : Promise<T[]>{
        let conn = await salesforceConnection();
        let result = await conn.sobject(this.objectName)
            .select(this.columns.join(", "))
            .where(filter)
            .execute();
        return result as T[];
    }

    protected async whereFilter(filter: (item:T) => void ) : Promise<T[]>{
        
        let jsonFilter = {} as T;
        filter(jsonFilter);

        let conn = await salesforceConnection();
        let result = await conn.sobject(this.objectName)
            .select(this.columns.join(", "))
            .where(jsonFilter)
            .execute();
            
        return result as T[];
    }}