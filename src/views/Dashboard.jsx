import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebaseConf';
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard = () => {

  const [allData, setAllData] = useState([])

  const fetchCertificates = async (email) => {
    const q = query(collection(db, "participents"), where("email", "==", "kallyan@apiffer.in"));

    const querySnapshot = await getDocs(q);
    let data = []
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      data.push(doc.data())
    });
    setAllData(data)
  }
  console.log(allData)

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        fetchCertificates(userAuth.email)
      }
    });
  }, [])

  return (
    <div>
        {
          allData.length && allData[0].cIds.map((eachRow, index) => (
            <div>
                <div>{eachRow}</div>
            </div>
          ))
        }
    </div>
  )
}

export default Dashboard