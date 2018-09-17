import { GetByIdQuery } from '../../../../src/server/features/contacts/getByIdQuery';
import { TestContext } from '../../testContextProvider';
import { IQuery, IContext } from '../../../../src/server/features/common/context';
import { IContact } from '../../../../src/ui/models';

describe('getByIdQuery', () => {
    it('when valid id then correct object', async () => {
        let context = new TestContext();
        let testData = context.testData;

        let data = testData.range(10, i => testData.createContact());
        let expected = data[5];

        let query = new GetByIdQuery(expected.Id);

        let result = await context.runQuery(query);

        expect(result).not.toBe(null);
        expect(result.id).toBe(expected.Id);
        expect(result.firstName).toBe(expected.FirstName);
        expect(result.lastName).toBe(expected.LastName);
    })
});
