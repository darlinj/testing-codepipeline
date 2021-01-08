#!/bin/bash

if [[ -z "${TEST_USERNAME}" ]]; then
  USERNAME=${1}
else
  USERNAME=${TEST_USERNAME}
fi
if [[ -z "${TEST_USER_PASSWORD}" ]]; then
  PASSWORD=${2}
else
  PASSWORD=${TEST_USER_PASSWORD}
fi
if [[ -z "${TEST_USERNAME}" ]]; then
  PROFILE="--profile admin"
else
  PROFILE=""
fi
if [[ -z "${CLIENT_ID}" ]]; then
  echo "FAIL: Cognito CLIENT_ID needs to be set"
fi
if [[ -z "${USER_POOL_ID}" ]]; then
  echo "FAIL: Cognito USER_POOL_ID needs to be set"
fi

aws cognito-idp sign-up --username ${USERNAME} --password ${PASSWORD} --client-id ${CLIENT_ID} --user-attributes Name=phone_number,Value="+441473123456" ${PROFILE}

aws cognito-idp admin-set-user-password --user-pool-id ${USER_POOL_ID} --username ${USERNAME} --password ${PASSWORD} --permanent ${PROFILE}
