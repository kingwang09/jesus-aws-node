import { RDSClient, ExecuteStatementCommand } from "aws-sdk";

// AWS 리전 및 Aurora RDS 설정
const region = 'your-region-name';
const rdsDataClient = new RDSClient({ region });

// Aurora RDS에서 SELECT 쿼리 실행 함수
async function selectFromAurora() {
  const executeStatementParams = {
    resourceArn: 'your-aurora-cluster-arn',
    secretArn: 'your-secret-arn',
    database: 'your-database-name',
    sql: 'SELECT * FROM your_table_name',
  };

  const command = new ExecuteStatementCommand(executeStatementParams);

  try {
    const response = await rdsDataClient.send(command);
    console.log('SELECT query result:', response.records);
  } catch (error) {
    console.error('Error executing SELECT query:', error);
  }
}

// 실행
selectFromAurora();