import { app } from "../firebaseConf";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, Timestamp, doc, setDoc } from "firebase/firestore";

const db = getFirestore(app);


//get all lists
export const getAllLists = async (uid) => {};

//generate certificate
export const generateCertificate = async (cId) => {};


//verify certificate
export const verifyCertificate = async (cId) => {};