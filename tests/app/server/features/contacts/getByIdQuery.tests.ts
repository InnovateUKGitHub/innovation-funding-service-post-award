import { expect } from 'chai';
import { GetByIdQuery } from '../../../../../app/server/features/contacts/getByIdQuery';
import {TestContext} from '../../testContextProvider';

describe('getByIdQuery', () => {
    it('when valid id then correct object', async () => {
        let context = new TestContext();
        let testData = context.testData;

        let data = testData.range(10, i => testData.createContact());
        let expected = data[5];

        let query = new GetByIdQuery(expected.Id);
        
        let result = await context.runQuery(query);

        expect(result).to.not.be.null;
        expect(result.id).to.equal(expected.Id);
        expect(result.firstName).to.equal(expected.FirstName);
        expect(result.lastName).to.equal(expected.LastName);
    })
});
