import React, { useEffect, useState } from "react";
import { auth, db ,maindb } from "../firebaseConf";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Outlet, useLocation, useNavigate  } from "react-router";
import { BiPowerOff } from "react-icons/bi";
import { BiArrowBack } from "react-icons/bi";

const Dashboard = () => {
  const [allData, setAllData] = useState([]);
  const [isRegistred,setIsRegistered] = useState(false)
  const navigate = useNavigate();
  const {pathname} = useLocation();
  useEffect(()=>{
    async function isRegistredCheck(email)
    {

      const q = query(
        collection(maindb, "registrations"),
        where("email", "==", email) // replace "shreyam@apiffer.in" with eamil
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          setIsRegistered(true)
        });
        
      }
      onAuthStateChanged(auth, (userAuth) => {
        if (userAuth) {
          isRegistredCheck(userAuth.email);
        }
      });
   ;
  },[])
  
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
      }
    }
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
//error
      });
  };

  const previewHandler = (cId, id , eventName) => {
    navigate(`/preview/${eventName}/${allData[0].name}/${cId}/${id}`);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        fetchCertificates(userAuth.email);
      }
    });
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className=" p-3 flex justify-between items-center">
      {pathname!=='/' && <BiArrowBack size={20}
      onClick={()=>navigate(-1)}
      />}
        {allData[0] ? (
          <h1 className="text-blue-400 text-md md:text-2xl mb-2 md:p-3 ">
            WELCOME{" "}
            <span className="font-bold text-blue-500">{allData[0].name.toUpperCase()}</span>
          </h1>
        ) : (
          <h1 className=" text-md md:text-2xl mb-2 md:p-3 ">
            
          </h1>
        )}
        <BiPowerOff
          className="mr-3 cursor-pointer text-red-500"
          size={"30px"}
          onClick={logoutHandler}
        />
      </div>
     {pathname==='/' && <div className="options flex flex-wrap gap-5 p-3 justify-center items-center">
        <div className="certificate w-[20rem] h-[10rem] bg-blue-400 hover:bg-blue-600 transition-all cursor-pointer p-5 text-white text-xl font-semibold uppercase" onClick={()=>navigate('/certificates')}>Cetrificates</div>
        {isRegistred && <div className="idcards w-[20rem] h-[10rem] bg-blue-400 hover:bg-blue-600 transition-all cursor-pointer text-white p-5 text-xl font-semibold uppercase" onClick={()=>navigate('/idcard')}>Idcard</div>}
      </div>}
      <Outlet/>
    </div>
  );
};

export default Dashboard;
