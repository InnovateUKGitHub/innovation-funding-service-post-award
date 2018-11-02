import jsforce from "jsforce";

// This will need revisting once SSO with Salesforce has been resolved
export interface ISalesforceConnectionDetails {
  username: string;
  password: string;
  token: string;
}

export const salesforceConnection = ({ username, password, token }: ISalesforceConnectionDetails) => {

  const connection = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com"
  });

  return new Promise<jsforce.Connection>((resolve, reject) => {
    if (!username || !password || !token) {
      throw new Error("Invalid connection details");
    }
    connection.login(username, password + token, (err, conn) => {
      if (err) {
        console.log("err connecting", err);
        reject(err);
      }
      else {
        resolve(connection);
      }
    });
  });
};
