import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { auth, db } from "../firebaseConf";
import { BiArrowBack } from "react-icons/bi";

function Preview() {
  const [cerData, setCerData] = useState();

  const { name, cId, id } = useParams();

  const navigate = useNavigate();
  let canvas;
  let ctx;
  let img = new Image();

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const fetchCertificatesData = async () => {
    const q = query(collection(db, "certMetas"), where("eId", "==", cId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setCerData(doc.data());
    });
  };

  console.log(cerData);
  function getImageAsBase64(url) {
    console.log(url)
    
    return fetch(url, {
      method: 'GET',
      mode:'no-cors'
    })
      .then(response => 
        response.blob())
      .then(blob => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      })
  }

  function getCoordinates(event) {
    // let xCord = event.clientX - 6;
    // let yCord = event.clientY - 6;
    //console.log("Coordinates: (" + xCord + ", " + yCord + ")");

    
    
  }


  /**
   * Function to download
   */
  const Download = async () => {
    var link = ref2.current;
    console.log(link);
    console.log(canvas)
    link.href = canvas.toDataURL();
    console.log(canvas.toDataURL());
    link.download = "image-with-text.png"; //name of the downloaded certificate
    
  };

  const backHandler = () => {
    navigate("/");
  };

  useEffect(()=>{
    canvas = ref1.current;
    ctx = canvas.getContext("2d");

    // Draw the image onto the canvas
    //img.crossOrigin = "Anonymous";
    async function renderImage()
    {

      if(cerData)
        img.src = await getImageAsBase64("https://firebasestorage.googleapis.com/v0/b/certificates-phoenix.appspot.com/o/templates%2F01GRM7JDHQQR4H2WJK8J8FXP1Y.png?alt=media&token=eaa4485c-e202-4736-9ff8-fdbc87cd3d62"); // change url
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
      <div className="p-5">
        <BiArrowBack
          className="cursor-pointer"
          size={"20px"}
          onClick={backHandler}
        />
      </div>
      <div className="flex flex-col overflow-y-auto items-center justify-center h-[80vh]">
        <div className="h-[60vh] ">
          <canvas
            ref={ref1}
            className="canvas"
            height="500"
            width="800"
            onMouseMove={getCoordinates}
          />
        </div>

        <a ref={ref2} id="save" onClick={Download}>
          <button className="inline-block self-center bg-blue-600 text-white font-bold rounded-lg px-6 py-2 uppercase  text-sm hover:bg-blue-600">
            Download
          </button>
        </a>
      </div>
    </>
  );
}

export default Preview;
