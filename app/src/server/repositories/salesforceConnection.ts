import jsforce from "jsforce";

// This will need revisting once SSO with Salesforce has been resolved

// user we have got working for now
let username = "oliver.armfelt@bjss.com.bjsspoc";
let password = "BjssBristol1";
let token    = "Wc2j67MQY6x0cXxYDKO2kddD";
// user given to us but auth token required
const username2 = "bjss.integration@innovateuk.gov.uk.bjss";
const password2 = "86S@lhJVSXRtsX81";

username = "etlsalesforce@innovateuk.gov.uk.bjsspoc2";
password = "pr0dETL2016";
token = "OWkKR7QYdHLgqz1s5HheCe86r";

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
