import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

let camera: Camera;

export default function App() {
  const [startCamera, setStartCamera] = React.useState(false);
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<any>(null);
  const [cameraType, setCameraType] = React.useState(CameraType.back);
  const [flashMode, setFlashMode] = React.useState("off");

  const __startCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync({ base64: true });

    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const __savePhoto = async () => {
    const response = await axios.post("http://10.10.4.176:3000/uploadImage", {
      image: capturedImage,
    });

    if (response.status === 201) {
      setStartCamera(false);
      setCapturedImage(null);
      setPreviewVisible(false);
    }
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };

  const __handleBack = () => {
    setStartCamera(false);
  };

  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType(CameraType.front);
    } else {
      setCameraType(CameraType.back);
    }
  };

  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: "100%",
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview
              photo={capturedImage}
              savePhoto={__savePhoto}
              retakePicture={__retakePicture}
            />
          ) : (
            <>
              <Camera
                type={cameraType}
                flashMode={flashMode}
                style={{ height: "89%", width: "100%" }}
                ref={(r) => {
                  camera = r;
                }}
              >
                <View
                  style={{
                    flex: 1,
                    width: "100%",
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      left: "5%",
                      top: "10%",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={__handleBack}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      <Ionicons
                        name="arrow-back"
                        color="white"
                        size={20}
                      ></Ionicons>
                    </TouchableOpacity>
                  </View>
                </View>
              </Camera>
              <View
                style={{
                  flexDirection: "row",
                  alignSelf: "center",
                  top: 5,
                  width: "90%",
                }}
              >
                <View>
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      marginTop: 20,
                      backgroundColor: flashMode === "off" ? "#000" : "#fff",
                      borderRadius: 50,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: "#000",
                    }}
                  />
                </View>

                <View>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                      borderRadius: 50,
                      height: 25,
                      width: 25,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                      }}
                    >
                      {cameraType === "front" ? "🤳" : "📷"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            width: "80%",
            flexDirection: "row",
            backgroundColor: "#fff",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={__switchCamera}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Switch Camera
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const CameraPreview = ({ photo, retakePicture, savePhoto }: any) => {
  return (
    <View
      style={{
        backgroundColor: "transparent",
        flex: 1,
        width: "100%",
        height: "100%",
      }}
    >
      <View>
        <Image
          source={{ uri: photo && photo.uri }}
          style={{
            resizeMode: "contain",
            width: "100%",
            height: "95%",
          }}
        ></Image>
      </View>
      <View
        style={{
          width: "100%",
          height: "5%",
          flexDirection: "column",
          padding: 15,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={retakePicture}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            >
              Re-take
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={savePhoto}
            style={{
              width: 130,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
              }}
            >
              save photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
