import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { auth, db } from "../firebaseConf";
import { BiArrowBack } from "react-icons/bi";
import axios from "axios";

function Preview() {
  const [cerData, setCerData] = useState();

  const { name, cId, id ,eventName} = useParams();

  const navigate = useNavigate();
  let canvas;
  let ctx;
  let img = new Image();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [CertLoading,setCertloading] = useState(true)
  const fetchCertificatesData = async () => {
    const q = query(collection(db, "certMetas"), where("eId", "==", cId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setCerData(doc.data());
    });
  };
  function getImageAsBase64(url) {
   

    return axios.get(url, { responseType: 'blob' })
    .then(response => {
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
        reader.onerror = reject;
      });
    });
  }

  function getCoordinates(event) {

  }

  const Download = async () => {
    var link = ref2.current;
    link.href = canvas.toDataURL();
    link.download = `${eventName}_${name}.png`; //name of the downloaded certificate
    
  };

  const backHandler = () => {
    navigate("/");
  };

  useEffect(()=>{
    canvas = ref1.current;
    ctx = canvas.getContext("2d");

    async function renderImage()
    {

      if(cerData)
      {
        img.src = await getImageAsBase64(cerData.cert_url); // change url
        setCertloading(false)
      }
    }

    renderImage();

    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add text to the image
      if (cerData) {
        ctx.font = "40px poppins";
        ctx.fillStyle = cerData.name.fontColor;
        ctx.fillText(name, cerData.name.xAxis, cerData.name.yAxis);
        ctx.font = "15px poppins";
        ctx.fillStyle = cerData.cId.fontColor;
        ctx.fillText(id, cerData.cId.xAxis, cerData.cId.yAxis);
      }
    };
  })

  useEffect(() => {

    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        fetchCertificatesData();
      }
    });
  }, []);

  return (
    <>
      <div className="p-5 shadow-md">
        <BiArrowBack
          className="cursor-pointer"
          size={"20px"}
          onClick={backHandler}
        />
      </div>
      <div className="flex flex-col overflow-hidden items-center justify-center h-[80vh] ">
        <div className={`xsm:scale-[.4] md:scale-[1] ${CertLoading && 'bg-slate-200 animate-pulse' } `}>
          <canvas
            ref={ref1}
            className="canvas"
            height="500"
            width="800"
            onMouseMove={getCoordinates}
            
          />
        </div>

        <a ref={ref2} id="save" onClick={Download}>
          <button className="inline-block self-center bg-blue-600 text-white font-bold rounded-lg px-6 py-3 shadow-md uppercase  text-sm hover:bg-blue-600 md:mt-5">
            Download
          </button>
        </a>
      </div>
    </>
  );
}

export default Preview;
