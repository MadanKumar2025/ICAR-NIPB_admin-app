import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function FeedbackView() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [feedback, setFeedback] = useState([]);

  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  const getFeedbackView = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/FeedbackSchemaRoutes/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFeedback(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.data?.message === "Invalid token") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    getFeedbackView();
  }, []);

  return (
    <>
      <div>
        <div
          className="card mb-4"
          style={{
            width: "90%",
            marginTop: "2vh",
            marginLeft: "5%",
            padding: "2%",
          }}
        >
          <div>
            <samp>Name :- </samp>
            <samp>{feedback?.data?.name}</samp>
          </div>

          <div>
            <samp>Message :- </samp>
            <samp>{feedback?.data?.message}</samp>
          </div>
        </div>
        <div className="d-flex justify-content-start">
          <div
            className="card-footer"
            style={{
              marginTop: "2vh",
              marginBottom: "2vh",
              marginLeft: "4vw",
            }}
          >
            <button className="btn btn-info" onClick={() => navigate(-1)}>
              Back{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FeedbackView;
