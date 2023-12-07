import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const REGION = process.env['AWS_REGION'];
const ENDPOINT = process.env['AWS_ENDPOINT'] || '';
const CRAWLER_QUEUE_URL = process.env['CRAWLER_QUEUE_URL'] || '';
interface sampleMessage{
    key: string;
    msg: string;
}
const msgParams = (msg: sampleMessage) => {
    return {
      MessageBody: JSON.stringify(msg),
      MessageDeduplicationId: `${msg.key}}`, // Required for FIFO queues
      MessageGroupId: 'CrawlingGroup', // Required for FIFO queues
      QueueUrl: CRAWLER_QUEUE_URL,
    };
  };

const main = () => {
    console.log(`hello REGION=${REGION}, ENDPOINT=${ENDPOINT}`);

    const config = {
        endpoint: new AWS.Endpoint(ENDPOINT),//https://sqs.ap-northeast-2.amazonaws.com
        region: REGION,//ap-northeast-2
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
    };
        
    // Create an SQS service object
    const SQS = new AWS.SQS(config);
    SQS.sendMessage(msgParams({key:'Hello', msg: 'World!!'}), function (err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data.MessageId);
        }
      });
}   

main();