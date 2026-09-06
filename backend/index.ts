import express from "express";
import redis, { createClient } from "redis";
import { db } from "./prisma/db";
import cors from "cors";

const client = await createClient();
client.connect();

const app = express();
app.use(express.json());
app.use(cors())

app.post("/submition",async (req, res) => {

    const code = req.body.code;
    const language = req.body.language;
     
    const response = await db.orm.public.Submissions.create({
        code,
        language,
        status: "Processing",
    });

    client.lPush("problems", JSON.stringify({submissionId: response.id, code, language }));  

    res.status(200).json({ message: "Submission received successfully", submissionId: response.id });
});


app.get("/submition/:submissionId", async (req, res) => {
    try {
        const response = await db.orm.public.Submissions.first({
            id: req.params.submissionId 
        });

        if (!response) {
            return res.status(404).json({ message: "Submission not found" });
        }

        res.status(200).json(response);
    } catch (err) {
        console.error("Failed to fetch submission", req.params.submissionId, err);
        res.status(500).json({ message: "Internal server error" });
    }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});