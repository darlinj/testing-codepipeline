#!/bin/bash

#USERNAME=chicken
USERNAME=${TEST_USERNAME}
PASSWORD=Passw0rd!
#CLIENT_ID=7ltjdkpko1ohr8tf5v8ncnl0in  
#USER_POOL_ID=eu-west-1_1i1dG5iTo

aws cognito-idp sign-up --username ${USERNAME} --password ${PASSWORD} --client-id ${CLIENT_ID} --profile admin --user-attributes Name=phone_number,Value="+441473123456" Name=email,Value="joe@example.com"
aws cognito-idp admin-set-user-password --user-pool-id ${USER_POOL_ID} --username ${USERNAME} --password ${PASSWORD} --permanent --profile admin
