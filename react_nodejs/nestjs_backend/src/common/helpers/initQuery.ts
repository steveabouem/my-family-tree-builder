import { DataSource } from 'typeorm';

const initializeQueryRunner = async (dataSource: DataSource) => {
  const qr = dataSource.createQueryRunner();
  await qr.connect();

  return qr;
};

export default initializeQueryRunner;
