import { expect } from 'chai';
import contextProvider from '../../../../../app/server/features/common/contextProvider';
import { GetByIdQuery } from '../../../../../app/server/features/contacts/getByIdQuery';

describe('getByIdQuery', () => {
    it('when valid id then correct object', async () => {
        let context = contextProvider.start();
        
        let query = new GetByIdQuery();
        query.id = "10";
        let result = await context.runQuery(query);

        expect(result).to.not.be.null;
        expect(result.id).to.equal("10");

        expect(result.lastName).to.equal("James");
    })
});





