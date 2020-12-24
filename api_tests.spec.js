import Amplify, { API, graphqlOperation } from "aws-amplify";

const aws_config = {
  aws_appsync_graphqlEndpoint:
    "https://rsdkewb7ozgg5juskbt3xrx4c4.appsync-api.eu-west-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-mc2r73rx5vhufhhtnver62edwu"
};

Amplify.configure(aws_config);

it("fetches things", () => {
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
