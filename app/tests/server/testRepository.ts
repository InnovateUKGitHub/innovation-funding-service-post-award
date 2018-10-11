export abstract class TestRepository<T> {
    Items: T[] = [];

    protected getOne(conditional: (item: T) => boolean): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            const found = this.Items.find(x => conditional(x));
            if (found) {
                resolve(found);
            }
            else {
                reject(new Error("NOT FOUND"));
            }
        });
    }

    protected getWhere(conditional: (item: T) => boolean): Promise<T[]> {
        return new Promise<T[]>((resolve) => {
            const found = this.Items.filter(x => conditional(x));
            resolve(found);
        });
    }

    protected getAll(): Promise<T[]> {
        return Promise.resolve(this.Items);
    }

    protected delete(): Promise<void> {
        return Promise.resolve();
    }

    protected insert(): Promise<string[]> {
        return Promise.resolve([ "a", "b" ]);
    }

    protected update(): Promise<void> {
        return Promise.resolve();
    }
}
