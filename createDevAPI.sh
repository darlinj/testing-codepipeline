#!/bin/bash
S3_BUCKET_NAME="pipeline-artifacts-bannana"
STACK_NAME=${API_NAME}

if aws s3 ls "s3://$S3_BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'
then
  aws s3 mb s3://${S3_BUCKET_NAME}
fi

aws cloudformation package --template-file "api/infra/rootStack.yml" --s3-bucket "${S3_BUCKET_NAME}" --s3-prefix "packagedCloudformationAssetsDEV/" --output-template-file "deploy/packagedTemplate.yml"

aws cloudformation deploy --template-file deploy/packagedTemplate.yml --stack-name ${STACK_NAME}Stack --parameter-overrides APIName=${STACK_NAME} --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
