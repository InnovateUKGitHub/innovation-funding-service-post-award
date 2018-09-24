import jsforce from "jsforce";

// This will need revisting once SSO with Salesforce has been resolved

// user we have got working for now
const username = "etlsalesforce@innovateuk.gov.uk.bjsspoc2";
const password = "pr0dETL2016";
const token = "OWkKR7QYdHLgqz1s5HheCe86r";
// user given to us but auth token required
const username2 = "bjss.integration@innovateuk.gov.uk.bjss";
const password2 = "86S@lhJVSXRtsX81";

export default () => {
  const connection = new jsforce.Connection({
    loginUrl : "https://test.salesforce.com"
  });

  return new Promise<jsforce.Connection>((resolve, reject) => {
    connection.login(username, password + token, (err, conn) => {
      if(err) {
        console.log("err connecting", err);
        reject(err);
      }
      else {
        resolve(connection);
      }
    });
  });
};
