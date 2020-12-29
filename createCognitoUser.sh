#!/bin/bash

aws cognito-idp sign-up --username user1 --password Passw0rd! --client-id 7ltjdkpko1ohr8tf5v8ncnl0in  --profile admin --user-attributes Name=phone_number,Value="+441473123456" Name=email,Value="joe@example.com"
aws cognito-idp admin-set-user-password --user-pool-id eu-west-1_1i1dG5iTo --username user1 --password Passw0rd! --permanent  --profile admin
