import { Suspense, useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Loader from "../utils/Loader";
import { apiRequest } from "../utils/BaseApi";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { getSessionId } from "../utils/get_session_id";

var containerStyle = {
  width: "95%",
  height: "480px",
  margin: "auto",
  borderRadius: "30px",
  borderColor: " #72315C",
  border: "none",
};

const Maps = () => {
  const [currentPosition, setCurrentPosition] = useState({});
  const queryClient = useQueryClient();
  const sessionId = getSessionId();
  const shop_location = (data) =>
    apiRequest({ url: "/shop/update_shop_location", method: "post", data });

  const { mutate: update_shop_location, isLoading: isLoading } = useMutation(
    shop_location,
    {
      onSuccess: (data) => {
        if (data?.data?.status) {
          toast.success(data?.data?.message);
        } else {
          toast.error(data?.data?.message);
        }

        queryClient.invalidateQueries("location");
      },
      onError: (err) => {
        toast.error(err);
      },
      retry: {
        maxAttempts: 3,
        delay: (attempt) => {
          return attempt * 1000;
        },
      },
    }
  );
  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("longitude", lng);
    formData.append("latitude", lat);

    update_shop_location(formData);
    setCurrentPosition({ lat, lng });
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDlgeEHHfciBFOki9nvENbxQ4V7F6pk25A",
  });
  const success = (position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="grid place-items-center bg-white z-20 top-0 right-0 bottom-0 left-0">
        <Suspense fallback={<div>Loading...</div>}>
          <Loader />
        </Suspense>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={13}
      center={currentPosition}
      animation={window.google.maps.Animation.DROP}
      onClick={handleMapClick}
    >
      {currentPosition.lat && <Marker position={currentPosition} />}
    </GoogleMap>
  );
};

export default Maps;
