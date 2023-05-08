import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConf";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router";

function CertificateList() {
    const [allData, setAllData] = useState([]);
  const [certData, setCertData] = useState([]);

  const navigate = useNavigate();

  const fetchCertificates = async (email) => {
    const q = query(
      collection(db, "participents"),
      where("email", "==", email) // replace "shreyam@apiffer.in" with eamil
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


  const previewHandler = (cId, id , eventName) => {
    navigate(`preview/${eventName}/${allData[0].name}/${cId}/${id}`);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        fetchCertificates(userAuth.email);
      }
    });
  }, []);
  return (
    <>
{allData[0] ? (
       
        <div class="flex flex-col">
  <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
      <div class="overflow-hidden">
        <table class="min-w-full text-left text-sm font-light">
          <thead class="border-b font-medium dark:border-neutral-500">
            <tr>
              <th scope="col" class="px-6 py-4">Event</th>
              <th scope="col" class="px-6 py-4 text-center">Date</th>
              <th scope="col" class="px-6 py-4 text-center">Download</th>
            </tr>
          </thead>
          <tbody>

            {
certData.map((e) => {
             return <tr
              key={e.id} class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
            
              <td class="whitespace-nowrap px-6 py-4 font-">{e.event}</td>
              <td class="whitespace-nowrap px-6 py-4 text-center">{e.eventDate}</td>
              <td class="whitespace-nowrap px-6 py-4 text-center">

              <button
                          className="inline-block self-center bg-blue-600 text-white font-bold rounded-lg md:px-6 py-2 uppercase p-3  text-sm hover:bg-blue-600"
                          onClick={() => {
                            previewHandler(e.eventId, e.id ,e.event);
                          }}
                        >
                          Download
                        </button>
              </td>
            </tr>
            })
          }
            
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
      ) : (
        <div className="text-center h-[70vh] text-blue-500 flex justify-center items-center font-bold text-[30px]">
          No Certificates Available !!!
        </div>
      )}
    </>
  )
}

export default CertificateList