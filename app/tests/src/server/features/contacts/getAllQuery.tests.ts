import { expect } from 'chai';
import { GetAllQuery } from '../../../../../src/server/features/contacts/getAllQuery';
import {TestContext} from '../../testContextProvider';

describe('getAllQuery', () => {
    it('when valid then returns all', async () => {
        let context = new TestContext();
        let testData = context.testData;

        let data = testData.range(10, i => testData.createContact());

        let query = new GetAllQuery();
        
        let result = await context.runQuery(query);

        expect(result).to.not.be.null;
        expect(result.map(x => x.id)).to.eql(data.map(x => x.Id));
    })
});
