import dotenv from 'dotenv';
dotenv.config();

import { S3 } from 'aws-sdk';
const s3 = new S3({ 
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'] || '',
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] || '',
    },
});
async function main() {
    console.log(process.env['AWS_ACCESS_KEY_ID']?.slice(0, 5));
    console.log(process.env['AWS_SECRET_ACCESS_KEY']?.slice(0, 5));
    const result = await uploadFile('ns-jesus-bucket', 'test.txt', Buffer.from('Hello World!!!!!!!!!!'));
    console.log(result);
}

async function uploadFile(bucketName: string, fileName: string, file: Buffer) {
    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        // ACL: 'public-read',
      };
      return new Promise((resolve, reject) => {
        s3.upload(params, (err: any, data: any) => {
          if (err){
            console.log(err);
            reject({ msg: err.message });
          }
          resolve(data);
        });
      });
}

async function downloadFile(bucketName: string, fileName: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };
    return new Promise((resolve, reject) => {
      s3.getObject(params, (err: any, data: any) => {
        if (err) reject(err.message);
        //writeFileSync(savePath, data.Body.toString());
        resolve(data);
      });
    });
  }
main();