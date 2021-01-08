import Amplify, { Auth } from "aws-amplify";
import { clearDatabase, addQuestionnaireForAnotherUser } from "./DBAdmin";
import {
  saveQuestionnaire,
  getQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaires
} from "../../src/apiCalls.js";
import awsConfig from "../../aws_config";

Amplify.configure(awsConfig);

beforeAll(async () => {
  await login();
});

beforeEach(async () => {
  const tableName = `${process.env.API_NAME}-questionnaires-table`;
  await clearDatabase(tableName);
});

const login = async () => {
  await Auth.signIn(process.env.TEST_USERNAME, process.env.TEST_USER_PASSWORD);
};

describe("The Questionnaire API", () => {
  it("Returns an empty array if there are no records in the DB", async () => {
    await getQuestionnaires().then(result => {
      expect(result.data).toEqual({
        getQuestionnaires: {
          questionnaires: []
        }
      });
    });
  });

  it("Adds a questionnaire and then checks it is there", async () => {
    await saveQuestionnaire("1234", "Some name");

    await getQuestionnaires().then(result => {
      expect(result.data).toEqual({
        getQuestionnaires: {
          questionnaires: [
            {
              id: "1234",
              name: "Some name"
            }
          ]
        }
      });
    });
  });

  it("Can't see items that don't belong to this user", async () => {
    const tableName = `${process.env.API_NAME}-questionnaires-table`;
    await addQuestionnaireForAnotherUser(tableName);

    await saveQuestionnaire("1234", "Some name");

    await getQuestionnaires().then(result => {
      expect(result.data).toEqual({
        getQuestionnaires: {
          questionnaires: [
            {
              id: "1234",
              name: "Some name"
            }
          ]
        }
      });
    });
  });

  it("Can get an individual Questionnaire by ID", async () => {
    await saveQuestionnaire("1234", "Some name");

    await getQuestionnaire("1234").then(result => {
      expect(result.data).toEqual({
        getQuestionnaire: {
          id: "1234",
          name: "Some name"
        }
      });
    });
  });

  it("Can delete an individual Questionnaire by ID", async () => {
    await saveQuestionnaire("1234", "Some name");

    await getQuestionnaire("1234").then(result => {
      expect(result.data).toEqual({
        getQuestionnaire: {
          id: "1234",
          name: "Some name"
        }
      });
    });

    await deleteQuestionnaire("1234");

    await getQuestionnaire("1234").then(result => {
      expect(result.data).toEqual({
        getQuestionnaire: null
      });
    });
  });

  it("deleting a Questionnaire that doesn't exist", async () => {
    await deleteQuestionnaire("9999").then(result => {
      expect(result.data).toEqual({ deleteQuestionnaire: null });
    });
  });
});
