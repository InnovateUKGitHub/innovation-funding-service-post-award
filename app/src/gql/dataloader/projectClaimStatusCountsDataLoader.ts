import { PartialGraphQLContext } from "@gql/GraphQLContext";
import { soql } from "@server/util/salesforce-string-helpers";
import DataLoader from "dataloader";

interface ProjectClaimStatusCountsData {
  totalSize: number;
  done: boolean;
  records: ProjectClaimStatusCountsRecord[];
}

interface ProjectClaimStatusCountsRecord {
  Acc_ClaimStatus__c: string;
  Acc_ProjectId__c: string;
  expr0: number;
}

/**
 * Get an instance of the claim counts dataloader, which batches requests to fetch claim counts,
 * then fetches all data required in one go instead of many separate requests.
 *
 * @param ctx The GraphQL Context
 * @returns A dataloader that fetches the claim status counts for each project
 */
const getProjectClaimStatusCountsDataLoader = (ctx: PartialGraphQLContext) => {
  return new DataLoader<string, ProjectClaimStatusCountsRecord[] | null>(
    async keys => {
      const data = await ctx.api.executeSOQL<ProjectClaimStatusCountsData>({
        query: soql`
        SELECT
          Acc_ClaimStatus__c,
          Acc_ProjectParticipant__r.Acc_ProjectId__c,
          Count(Id)
        FROM Acc_Claims__c
        WHERE
          RecordType.DeveloperName = 'Total_Project_Period'
          AND Acc_ProjectId__c in ${keys}
        GROUP BY
          Acc_ClaimStatus__c,
          Acc_ProjectParticipant__r.Acc_ProjectId__c
      `,
      });

      // For each key that was passed in, find the count data.
      // A map is chosen to ensure the data is in the EXACT order as requested.
      return keys.map(key => data.records.filter(x => x.Acc_ProjectId__c === key));
    },
    // Assuming each project ID returns a max of 15 counts (there are only 12 statuses),
    // limit our batch size so each project can return all 12 counts each
    { maxBatchSize: Math.floor(2000 / 15) },
  );
};

export { getProjectClaimStatusCountsDataLoader };
