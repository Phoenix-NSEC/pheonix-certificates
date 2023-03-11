import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConf";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { BiPowerOff } from "react-icons/bi";

const Dashboard = () => {
  const [allData, setAllData] = useState([]);
  const [certData, setCertData] = useState([]);

  const navigate = useNavigate();

  const fetchCertificates = async (email) => {
    const q = query(
      collection(db, "participents"),
      where("email", "==", "shreyam@apiffer.in")  // replace "shreyam@apiffer.in" with eamil
    );

    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      
      data.push(doc.data());
    });
    setAllData(data);
    let cerData = [];
    if (data[0]) {
      if (data[0].cIds.length < 10) {
        const cq = query(
          collection(db, "cIds"),
          where("id", "in", data[0].cIds)
        );
        const certificateSnap = await getDocs(cq);
        certificateSnap.forEach((doc) => {
          cerData.push(doc.data());
        });
        setCertData(cerData);
      } else {
        const allCertificateRef = collection(db, "cIds");

        const dataItems = await getDocs(allCertificateRef);

        const filteredData = dataItems.docs.map((doc) => ({
          ...doc.data(),
        }));

        for (let i of data[0].cIds) {
          for (let j of filteredData) {
            if (i === j.id) {
              cerData.push(j);
              break;
            }
          }
        }
        setCertData(cerData);
      }
    }
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const previewHandler = (cId,id)=>{
    navigate(`/preview/${allData[0].name}/${cId}/${id}`);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        fetchCertificates(userAuth.email);
      }
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className=" p-3 flex justify-between items-center">
        <h1 className=" text-md md:text-2xl mb-2 md:p-3 ">
          WELCOME <span className="font-bold">{allData[0] ? allData[0].name.toUpperCase() : ""}</span>
        </h1>
        <BiPowerOff className="mr-3 cursor-pointer text-red-500" size={"30px"} onClick={logoutHandler}/>
      </div>

      <div className="p-5 flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold p-5 text-center mb-2">
         CERTIFICATES
        </h1>
        <div className="overflow-auto md:w-2/3 rounded-lg shadow block ">
        
          <div className="w-full">
            <div className="bg-gray-50 border-b-2 border-gray-200">
              <ul className="flex justify-between w-full">
                <li className="p-3 md:pl-7 text-sm md:text-lg font-semibold text-left">
                  Event 
                </li>
                <li className="p-3 pr-[92px] md:pr-[115px] text-sm md:text-lg font-semibold tracking-wide text-left">
                  Date 
                </li>
                <li className=" p-3 text-sm md:text-lg text-center font-semibold tracking-wide ">
                  
                </li>
              </ul>
            </div>
            <div className=" divide-gray-100">
              {certData.map((e) => {
                return (
                  <ul
                    key={e.id}
                    className="bg-white flex justify-between items-center mb-2"
                  >
                    <li className="p-3 md:font-bold md:text-lg text-sm text-gray-700 whitespace-nowrap">
                      {e.event}
                    </li>
                    <li className="p-3 md:text-md md:font-bold text-sm text-gray-700 whitespace-nowrap">
                      {e.eventDate}
                    </li>
                    <li className="p-3  text-sm text-gray-700 whitespace-nowrap">
                      <button className="inline-block self-center bg-blue-600 text-white font-bold rounded-lg md:px-6 py-2 uppercase p-3  text-sm hover:bg-blue-600" onClick={()=>{previewHandler(e.eventId,e.id)}}>
                        Download
                      </button>
                    </li>
                  </ul>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
