const awsConfig = {
  aws_project_region: "eu-west-1",
  aws_appsync_graphqlEndpoint: process.env.APIEndpoint,
  aws_appsync_region: "eu-west-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  aws_appsync_apiKey: "null",
  aws_cognito_region: "eu-west-1",
  aws_user_pools_id: process.env.USER_POOL_ID,
  authenticationFlowType: "USER_PASSWORD_AUTH",
  aws_user_pools_web_client_id: process.env.CLIENT_ID
};

export default awsConfig;
