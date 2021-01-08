import Amplify, { Auth } from "aws-amplify";
import { clearDatabase, addQuestionForAnotherUser } from "./DBAdmin";
import {
  saveQuestion,
  //  getQuestion,
  //  deleteQuestion,
  getQuestions
} from "../../src/apiCalls.js";
import awsConfig from "../../aws_config";

Amplify.configure(awsConfig);

beforeEach(async () => {
  await login();
  await clearDatabase(`${process.env.API_NAME}-questions-table`);
});

const login = async () => {
  await Auth.signIn(process.env.TEST_USERNAME, process.env.TEST_USER_PASSWORD);
};

describe("The Question API", () => {
  it("Returns an empty array if there are no records in the DB", async () => {
    await getQuestions().then(result => {
      expect(result.data).toEqual({
        getQuestions: {
          questions: []
        }
      });
    });
  });

  it("Adds a question and then checks it is there", async () => {
    const question = { questionnaireId: "12345", question: "Some question" };
    await saveQuestion(question);

    await getQuestions().then(result => {
      expect(result.data.getQuestions.questions[0].question).toEqual(
        "Some question"
      );
      expect(result.data.getQuestions.questions[0].questionnaireId).toEqual(
        "12345"
      );
      expect(result.data.getQuestions.questions[0].id.length).toBeGreaterThan(
        10
      );
    });
  });

  //  it("Can't see items that don't belong to this user", async () => {
  //    await addQuestionForAnotherUser();
  //
  //    await saveQuestion("1234", "Some content", "Some title");
  //
  //    await getQuestions().then(result => {
  //      expect(result.data).toEqual({
  //        getQuestions: {
  //          questions: [
  //            {
  //              QuestionId: "1234",
  //              content: "Some content",
  //              title: "Some title"
  //            }
  //          ]
  //        }
  //      });
  //    });
  //  });
  //
  //  it("Can get an individual Question by ID", async () => {
  //    await saveQuestion("1234", "Some content", "Some title");
  //
  //    await getQuestion("1234").then(result => {
  //      expect(result.data).toEqual({
  //        getQuestion: {
  //          QuestionId: "1234",
  //          content: "Some content",
  //          title: "Some title"
  //        }
  //      });
  //    });
  //  });
  //
  //  it("Can delete an individual Question by ID", async () => {
  //    await saveQuestion("1234", "Some content", "Some title");
  //
  //    await getQuestion("1234").then(result => {
  //      expect(result.data).toEqual({
  //        getQuestion: {
  //          QuestionId: "1234",
  //          content: "Some content",
  //          title: "Some title"
  //        }
  //      });
  //    });
  //
  //    await deleteQuestion("1234");
  //
  //    await getQuestion("1234").then(result => {
  //      expect(result.data).toEqual({
  //        getQuestion: null
  //      });
  //    });
  //  });
  //
  //  it("deleting a Question that doesn't exist", async () => {
  //    await deleteQuestion("9999").then(result => {
  //      expect(result.data).toEqual({ deleteQuestion: null });
  //    });
  //  });
});
