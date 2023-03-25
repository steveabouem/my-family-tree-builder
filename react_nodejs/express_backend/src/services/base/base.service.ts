import db from '../../db';
import { DUserDTO as T } from '../../dtos/user.dto';

export class BaseService<T> {// NO MATHING MODEL, base fof all of our services
    async getById(p_select: string): Promise<any> {
        await db.authenticate();
        const records = await db.query(p_select);

        return records[0];
    }

    getDTOMapping = (): Record<keyof T, any> => {
        // TODO: figure out how to map the generic type's keys to retur an object
        // @ts-expect-error
        const keys = Object.keys({} as T);
        console.log({ keys });

        const obj: Record<keyof T, any> = {} as Record<keyof T, any>;
        for (const key of keys) {
            obj[key as keyof T] = null; // Initialize each key with null value
        }
        console.log(obj);

        return obj;
    }

}