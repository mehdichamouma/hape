const {
    Client,
    Ed25519PrivateKey,
    Ed25519PublicKey,
    ConsensusMessageSubmitTransaction,
    ConsensusTopicCreateTransaction
} = require("@hashgraph/sdk");
require("dotenv").config();
// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-1" });
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

var queueURL =
    "https://sqs.us-east-1.amazonaws.com/167132469921/mehdichamoumagmailcom_a6093ccdcab6493da800c3492a75c34a.fifo";

var params = {
    AttributeNames: ["SentTimestamp"],
    // MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
    QueueUrl: queueURL,
    VisibilityTimeout: 10
    // WaitTimeSeconds: 0
};

function checkMessage(onMessage) {
    console.log("sqs.receiveMessage");
    sqs.receiveMessage(params, function (err, data) {
        if (err) {
            console.log("Receive Error", err);
        } else if (data.Messages) {
            onMessage(data.Messages[0]);
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            sqs.deleteMessage(deleteParams, function (err, data) {
                if (err) {
                    console.log("Delete Error", err);
                } else {
                }
            });
        } else {
        }
    });
    setTimeout(() => checkMessage(onMessage), 6000);
}

let TOPIC_ID = "0.0.67652";

const operatorPrivateKey = process.env.OPERATOR_KEY;
const operatorAccount = process.env.OPERATOR_ID;

if (operatorPrivateKey == null || operatorAccount == null) {
    throw new Error(
        "environment variables OPERATOR_KEY and OPERATOR_ID must be present"
    );
}

async function init(onMessage) {
    checkMessage(onMessage);
}

async function sendMessage(message) {
    const client = Client.forTestnet();
    client.setOperator(operatorAccount, operatorPrivateKey);
    const messageQuery = await new ConsensusMessageSubmitTransaction()
        .setTopicId(TOPIC_ID)
        .setMessage(message)
        .execute(client);

    const messageReceipt = await messageQuery.getReceipt(client);
}

module.exports = {
    init,
    sendMessage
}
