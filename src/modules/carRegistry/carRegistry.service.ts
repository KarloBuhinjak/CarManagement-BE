import { ethers } from "ethers";
import CarMileageAbi from "./abi/CarMileage.json";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS as string;
const contractAbi = CarMileageAbi.abi;
export const carContract = new ethers.Contract(
  contractAddress,
  contractAbi,
  provider,
);

export const getCarRecords = async (vin: string) => {
  const records = await carContract.getRecords(vin);
  return records.map((r: any) => ({
    mileage: Number(r.mileage),
    timestamp: Number(r.timestamp),
    mechanic: r.mechanic,
  }));
};
