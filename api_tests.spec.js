import Amplify, { API, graphqlOperation } from "aws-amplify";

const aws_config = {
  aws_appsync_graphqlEndpoint: process.env.APIEndpoint,
  aws_appsync_region: "eu-west-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-mc2r73rx5vhufhhtnver62edwu"
};

Amplify.configure(aws_config);

it("fetches things", () => {
  console.log("API Endpoint: ", process.env.APIEndpoint);
  const query = graphqlOperation(`query MyQuery {
  get(id: "123", meta: "somedata", title: "sdfds") {
    meta
    id
    title
  }
}`);
  API.graphql(query).then(result => {
    expect(result.data["get"]["meta"]).toEqual(
      "Meta stuff: somedata Inserted text"
    );
  });
});
