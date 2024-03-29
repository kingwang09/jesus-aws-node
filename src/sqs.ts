import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const REGION = process.env['AWS_REGION'];
const ENDPOINT = process.env['AWS_ENDPOINT'] || '';
const CRAWLER_QUEUE_URL = process.env['CRAWLER_QUEUE_URL'] || '';
interface sampleMessage{
    id: number;
    modelName?: string;
    brand?: string;
    categoryKey?: string;
    link: string;
}
const msgParams = (msg: sampleMessage) => {
    return {
        MessageBody: JSON.stringify(msg),
        MessageDeduplicationId: `${msg.id}}`, // Required for FIFO queues
        MessageGroupId: 'CrawlingGroup', // Required for FIFO queues
        QueueUrl: CRAWLER_QUEUE_URL,
    };
};


console.log(`hello REGION=${REGION}, ENDPOINT=${ENDPOINT}`);

const config = {
    endpoint: new AWS.Endpoint(ENDPOINT),//https://sqs.ap-northeast-2.amazonaws.com
    region: REGION,//ap-northeast-2
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
};
    
// Create an SQS service object
const SQS = new AWS.SQS(config);

const main = () => {
    sendMessage({id: 1, modelName: 'LHBEC-H', brand: '삼성전자', categoryKey: 'tv', link:'https://www.coupang.com/vp/products/7754154974?vendorItemId=86017408949&sourceType=HOME_TRENDING_ADS&searchId=feed-703184e797434a9d93bbf8af1fdbbc07-trending_ads-72623&clickEventId=289c2aa0-97fc-11ee-b046-7bc330a0ef52&isAddedCart=#sdpReview'});

    //receiveMessage();
    
}   

const sendMessage = (message: sampleMessage) => {
    SQS.sendMessage(msgParams(message), function (err, data) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Success', data.MessageId);
        }
    });
}


const receiveParam = {
    AttributeNames: ['SentTimestamp'],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: ['All'],
    QueueUrl: CRAWLER_QUEUE_URL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0,
};

const receiveMessage = async () => {
    const data = await SQS.receiveMessage(receiveParam).promise();
    console.log('receiveMessage: data=', data);
    if (data.Messages) {
        //delete receive message
        const deleteParams = {
          QueueUrl: CRAWLER_QUEUE_URL,
          ReceiptHandle: data.Messages[0].ReceiptHandle || '',
        };
        SQS.deleteMessage(deleteParams, function (err, data) {
          if (err) {
            console.log('Delete Error', err);
          }
        });
      
        const body = data.Messages[0].Body;
        console.log('receiveMessage: body=', body);
    }

}

main();