#!/bin/bash

if [[ -z "${TEST_USERNAME}" ]]; then
  USERNAME=${1}
else
  USERNAME=${TEST_USERNAME}
fi
if [[ -z "${TEST_USERNAME}" ]]; then
  PROFILE="--profile admin"
else
  PROFILE=""
fi
if [[ -z "${CLIENT_ID}" ]]; then
  CLIENT_ID=7ltjdkpko1ohr8tf5v8ncnl0in  
fi
if [[ -z "${USER_POOL_ID}" ]]; then
  USER_POOL_ID=eu-west-1_1i1dG5iTo
fi
PASSWORD=Passw0rd!

aws cognito-idp sign-up --username ${USERNAME} --password ${PASSWORD} --client-id ${CLIENT_ID} --user-attributes Name=phone_number,Value="+441473123456" Name=email,Value="joe@example.com" ${PROFILE}

aws cognito-idp admin-set-user-password --user-pool-id ${USER_POOL_ID} --username ${USERNAME} --password ${PASSWORD} --permanent ${PROFILE}
