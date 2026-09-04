import redis, { createClient } from "redis";

const client = await createClient();
client.connect().then(async () => {

    while(1){
        const response = await client.rPop("problems");
        if(!response) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
            continue;
        }
        const parssedResponse = JSON.parse(response);
        const code = parssedResponse.code;
        const language = parssedResponse.language;
        console.log("processing submission:", parssedResponse.userID, parssedResponse.questionID);
        if(language === "ts") {
            console.log("Running user's TypeScript code:", code);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }

}).catch((err) => {
    console.error("Error connecting to Redis:", err);
});

export { client };