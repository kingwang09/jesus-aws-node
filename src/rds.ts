import { RDSDataService } from 'aws-sdk';
import { Credentials } from 'aws-sdk/lib/core';
import dotenv from 'dotenv';

dotenv.config();

const REGION = process.env['AWS_REGION'];
const ACCESS_KEY = process.env['AWS_ACCESS_KEY_ID'] || '';
const SECRET_KEY = process.env['AWS_SECRET_ACCESS_KEY'] || '';
const AWS_RDS_RESOURCE_ARN = process.env['AWS_RDS_RESOURCE_ARN'] || '';
const AWS_SECRET_ARN = process.env['AWS_SECRET_ARN'] || '';

console.log(`REGION: ${REGION}`);
// AWS 자격 증명 설정 (accessKeyId와 secretAccessKey를 실제 자격 증명으로 교체)
const credentials = new Credentials({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
});

// RDS 엔드포인트 및 데이터베이스 정보 설정
const rds = new RDSDataService({
  credentials: credentials,
  region: REGION, // AWS 리전 (예: us-east-1)
});
console.log('RDSDataService complete.');

const dbOptions = {
  resourceArn: AWS_RDS_RESOURCE_ARN,
  secretArn: AWS_SECRET_ARN,
  database: 'postgres',
};

// 리스트 목록을 반환하는 함수
async function getListData(): Promise<string[]> {
  const sql = 'SELECT name FROM hello';
  const params = {
    secretArn: dbOptions.secretArn,
    resourceArn: dbOptions.resourceArn,
    sql: sql,
    database: dbOptions.database,
  };

  try {
    const result = await rds.executeStatement(params).promise();
    console.log('Query result:', result);

    // 결과에서 필요한 데이터 추출
    if(result.records){
        const dataList: string[] = result.records.map((record: any) => record[0].stringValue);
        console.log('List of data:', dataList);
        return dataList;
    }
    return [];
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

// 쿼리 실행 및 리스트 목록 반환
getListData();