import { exec } from 'child_process';

exec('curl -s https://test.api.amadeus.com/v1/security/oauth2/token" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=client_credentials&client_id=TjoaeFDE9hRkdigYZ5PvG6xgmnEprNWn&client_secret=nysAxCYOo5UddBa8', (error, stdout, stderr) => {
  console.log("Hello World")
    if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});