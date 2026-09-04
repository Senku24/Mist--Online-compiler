import express from "express";
import redis, { createClient } from "redis";

const client = await createClient();
client.connect();

const app = express();
app.use(express.json());



app.post("/submition", (req, res) => {
    const userID = req.body.userID;
    const questionID = req.body.questionID;
    const code = req.body.code;
    const language = req.body.language;
     
    client.lPush("problems", JSON.stringify({ userID, questionID, code, language }));  

    res.status(200).json({ message: "Submission received successfully", submissionId: { userID, questionID, code, language } });
});

app.get("/submition/:submissionId", (req, res) => {

});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});